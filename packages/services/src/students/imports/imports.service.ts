import { prisma } from '@pedaki/db';
import type { ImportUpload, ImportUploadStatus } from '~/students/imports/import.model.ts';
import type {
  ClassImport,
  ClassLevelImport,
  FileProcessor,
  StudentImport,
} from '~/students/imports/processor/processor.ts';
import { FILE_PROCESSORS } from '~/students/imports/processor/processor.ts';

class StudentImportsService {
  async createImport(): Promise<string> {
    const data = await prisma.import.create({
      data: {
        status: 'PENDING',
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
      throw new Error('No processor found'); // TODO: error code
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
    classes.forEach((class_, index) => {
      const level = importClassLevelIds.find(l => l.name === class_._rawLevel);
      if (level) {
        class_.importLevelId = level.id;
      }
    });
    // throw if importLevelId is not set for a class
    if (classes.some(class_ => !class_.importLevelId)) {
      throw new Error('ImportLevelId not set for a class'); // TODO: error code
    }

    await prisma.importClass.createMany({
      data: classes.map(class_ => ({
        importId: id,
        classId: class_.classId ?? undefined,
        importLevelId: class_.importLevelId!,
        name: class_.name,
      })),
    });

    await prisma.importStudent.createMany({
      data: students.map(student => ({
        importId: id,
        studentId: student.studentId ?? undefined,
        firstName: student.firstName,
        lastName: student.lastName,
        birthDate: student.birthDate,
        otherName: student.otherName ?? undefined,
      })),
    });
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
                name: c._rawLevel,
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
}

const studentImportsService = new StudentImportsService();
export { studentImportsService };
