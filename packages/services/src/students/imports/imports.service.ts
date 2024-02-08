import { prisma } from '@pedaki/db';
import type { ImportUpload, ImportUploadStatus } from '~/students/imports/import.model.ts';
import type {
  ClassImport,
  ClassLevelImport,
  FileProcessor,
  StudentImport,
} from '~/students/imports/processor/processor.ts';
import { FILE_PROCESSORS } from '~/students/imports/processor/processor.ts';
import dayjs from 'dayjs';

export const classHash = (name: string, level: string): string => `${level}-${name}`;

class StudentImportsService {
  async createImport(name: string): Promise<string> {
    const data = await prisma.import.create({
      data: {
        status: 'PENDING',
        name,
      },
      select: {
        id: true,
      },
    });
    return data.id;
  }

  async #updateStatus<T extends ImportUploadStatus['status']>(
    id: string,
    status: T,
    data: ImportUploadStatus['data'],
  ): Promise<void> {
    await prisma.import.update({
      where: {
        id,
      },
      data: {
        status,
        data,
      },
    });
  }

  #getFileProcessor(file: ImportUpload): FileProcessor {
    let fileProcessor: FileProcessor | null = null;
    for (const processor of FILE_PROCESSORS) {
      const instance = new processor();
      if (instance.canProcess(file)) {
        fileProcessor = instance;
        break;
      }
    }

    if (!fileProcessor) {
      throw new Error('UNKNOWN_FORMAT');
    }
    return fileProcessor;
  }

  async #insertData(
    id: string,
    classes: ClassImport[],
    levels: ClassLevelImport[],
    students: StudentImport[],
  ): Promise<void> {
    const importClassLevelIds = await prisma.$transaction(
      levels.map(level =>
        prisma.importClassLevel.create({
          data: {
            importId: id,
            classLevelId: level.classLevelId ?? undefined,
            name: level.name,
          },
          select: {
            id: true,
            name: true,
          },
        }),
      ),
    );

    // set importLevelId to classes
    classes.forEach(class_ => {
      const level = importClassLevelIds.find(l => l.name === class_.__rawLevel);
      if (level) {
        class_.importLevelId = level.id;
      }
    });
    // throw if importLevelId is not set for a class
    if (classes.some(class_ => !class_.importLevelId)) {
      throw new Error('ImportLevelId not set for a class'); // TODO: error code
    }

    const importClassIds = await prisma.$transaction(
      classes.map(class_ =>
        prisma.importClass.create({
          data: {
            importId: id,
            classId: class_.classId ?? undefined,
            importLevelId: class_.importLevelId!,
            name: class_.name,
          },
          select: {
            id: true,
            name: true,
            importLevel: {
              select: {
                name: true,
              },
            },
          },
        }),
      ),
    );

    classes.forEach(class_ => {
      const currentClassHash = classHash(class_.name, class_.__rawLevel);
      class_.__importClassId = importClassIds.find(
        ic => currentClassHash === classHash(ic.name, ic.importLevel.name),
      )?.id;
    });

    // set classId to students
    students.forEach(student => {
      const class_ = classes.find(c => c.__classHash === student.__classHash);
      if (class_?.__importClassId !== undefined) {
        student.__importClassId = class_.__importClassId;
      }
    });

    // set classId to importStudents
    await prisma.$transaction(
      students.map(student =>
        prisma.importStudent.create({
          data: {
            importId: id,
            studentId: student.studentId ?? undefined,
            firstName: student.firstName,
            lastName: student.lastName,
            birthDate: student.birthDate,
            otherName: student.otherName ?? undefined,
            gender: student.gender ?? undefined,
            importClasses: {
              connect: student.__importClassId ? [{ id: student.__importClassId }] : undefined,
            },
          },
        }),
      ),
    );
  }

  async #mapData(
    classes: ClassImport[],
    levels: ClassLevelImport[],
    students: StudentImport[],
  ): Promise<void> {
    const [existingClasses, existingLevels, existingStudents] = await Promise.all([
      prisma.$transaction(
        classes.map(c =>
          prisma.class.findFirst({
            where: {
              name: c.name,
              level: {
                name: c.__rawLevel,
              },
            },
            select: {
              id: true,
            },
          }),
        ),
      ),
      prisma.$transaction(
        levels.map(level =>
          prisma.classLevel.findFirst({
            where: {
              name: level.name,
            },
            select: {
              id: true,
            },
          }),
        ),
      ),
      prisma.$transaction(
        students.map(student =>
          prisma.student.findFirst({
            where: {
              firstName: student.firstName,
              lastName: student.lastName,
              birthDate: student.birthDate,
              otherName: student.otherName ?? undefined,
            },
            select: {
              id: true,
            },
          }),
        ),
      ),
    ]);

    // set studentId to students
    students.forEach((student, index) => {
      student.studentId = existingStudents[index]?.id ?? undefined;
    });

    // set classId to classes
    classes.forEach((class_, index) => {
      class_.classId = existingClasses[index]?.id ?? undefined;
    });

    // set levelId to levels
    levels.forEach((level, index) => {
      level.classLevelId = existingLevels[index]?.id ?? undefined;
    });
  }

  async processFile(id: string, file: ImportUpload): Promise<void> {
    try {
      const fileProcessor = this.#getFileProcessor(file);
      await this.#updateStatus(id, 'PROCESSING', {
        family: fileProcessor.name,
      });

      fileProcessor.prepare();

      await this.#mapData(
        fileProcessor.getClasses(),
        fileProcessor.getClassLevels(),
        fileProcessor.getStudents(),
      );
      await this.#insertData(
        id,
        fileProcessor.getClasses(),
        fileProcessor.getClassLevels(),
        fileProcessor.getStudents(),
      );

      await this.#updateStatus(id, 'DONE', {
        family: fileProcessor.name,
        students: {
          insertedCount: fileProcessor.getStudents().length,
          mappedCount: fileProcessor.getStudents().filter(s => s.studentId !== undefined).length,
        },
        classes: {
          insertedCount: fileProcessor.getClasses().length,
          mappedCount: fileProcessor.getClasses().filter(c => c.classId !== undefined).length,
        },
        levels: {
          insertedCount: fileProcessor.getClassLevels().length,
          mappedCount: fileProcessor.getClassLevels().filter(l => l.classLevelId !== undefined)
            .length,
        },
      });
    } catch (e) {
      await this.#updateStatus(id, 'ERROR', {
        message: (e as Error).message, // TODO check error code
      });
    }
  }

  async confirmImport(id: string): Promise<void> {
    // TODO split method

    const importLevels = await prisma.importClassLevel.findMany({
      where: {
        importId: id,
      },
    });

    // upsert new levels
    await prisma.$transaction(
      importLevels.map(importLevel => {
        if (importLevel.classLevelId) {
          return prisma.classLevel.update({
            where: {
              id: importLevel.classLevelId,
            },
            data: {
              name: importLevel.name,
              importClassLevel: {
                connect: {
                  id: importLevel.id,
                },
              },
            },
            select: {
              id: true,
            },
          });
        }
        return prisma.classLevel.create({
          data: {
            name: importLevel.name,
            // TODO: random color
            color: '#0000FF',
            importClassLevel: {
              connect: {
                id: importLevel.id,
              },
            },
          },
          select: {
            id: true,
          },
        });
      }),
    );

    const importClasses = await prisma.importClass.findMany({
      where: {
        importId: id,
      },
      include: {
        importLevel: {
          select: {
            classLevelId: true,
          },
        },
      },
    });

    // TODO add parameter for this (and check timezones)
    const startDate = dayjs().add(1, 'year').startOf('year').toDate();
    const endDate = dayjs().add(1, 'year').endOf('year').toDate();
    const academicYear = {
      startDate,
      endDate,
      name: `${startDate.getFullYear()}/${endDate.getFullYear()}`,
    };
    try {
      await prisma.academicYear.create({
        data: academicYear,
        select: {
          id: true,
        },
      });
    } catch (e) {
      // academic year already exists
    }

    // upsert new classes
    await prisma.$transaction(
      importClasses.map(importClass => {
        if (importClass.classId) {
          return prisma.class.update({
            where: {
              id: importClass.classId,
            },
            data: {
              level: {
                connect: {
                  id: importClass.importLevel.classLevelId!,
                },
              },
              name: importClass.name,
            },
            select: {
              id: true,
            },
          });
        } else {
          return prisma.class.create({
            data: {
              level: {
                connect: {
                  id: importClass.importLevel.classLevelId!,
                },
              },
              academicYear: {
                connect: {
                  name: academicYear.name,
                },
              },
              importClass: {
                connect: {
                  id: importClass.id,
                },
              },
              name: importClass.name,
            },
            select: {
              id: true,
            },
          });
        }
      }),
    );

    // create students
    const importStudents = await prisma.importStudent.findMany({
      where: {
        importId: id,
      },
      include: {
        importClasses: {
          select: {
            classId: true,
          },
        },
      },
    });

    await prisma.$transaction(
      importStudents.map(importStudent => {
        if (importStudent.studentId) {
          return prisma.student.update({
            where: {
              id: importStudent.studentId,
            },
            data: {
              firstName: importStudent.firstName,
              lastName: importStudent.lastName,
              birthDate: importStudent.birthDate,
              otherName: importStudent.otherName ?? undefined,
              gender: importStudent.gender,
              classes: {
                set: importStudent.importClasses.map(ic => ({ id: ic.classId! })) ?? undefined,
              },
            },
          });
        }
        return prisma.student.create({
          data: {
            firstName: importStudent.firstName,
            lastName: importStudent.lastName,
            birthDate: importStudent.birthDate,
            otherName: importStudent.otherName ?? undefined,
            gender: importStudent.gender,
            properties: {},
            classes: {
              connect: importStudent.importClasses.map(ic => ({ id: ic.classId! })) ?? undefined,
            },
          },
          select: {
            id: true,
          },
        });
      }),
    );

    // delete import
    await prisma.import.delete({
      where: {
        id,
      },
    });
  }
}

const studentImportsService = new StudentImportsService();
export { studentImportsService };
