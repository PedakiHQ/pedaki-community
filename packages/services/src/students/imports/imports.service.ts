import { prisma } from '@pedaki/db';
import type { ImportUpload, ImportUploadStatus } from '~/students/imports/import.model.ts';
import type { FileProcessor, StudentImport } from '~/students/imports/processor/processor.ts';
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

  prepare(processor: FileProcessor): StudentImport[] {
    const students = processor.prepare();
    if (students.length === 0) {
      throw new Error('No students found'); // TODO: error code
    }

    return students;
  }

  async #mapStudents(students: StudentImport[]): Promise<StudentImport[]> {
    const existingStudents = await prisma.$transaction(
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
    );

    // set studentId to students
    students.forEach((student, index) => {
      student.studentId = existingStudents[index]?.id ?? null;
    });

    return students;
  }

  async #insertStudents(id: string, students: StudentImport[]): Promise<void> {
    await prisma.importStudent.createMany({
      data: students.map(student => ({
        importId: id,
        studentId: student.studentId ?? undefined,
        firstName: student.firstName,
        lastName: student.lastName,
        birthDate: student.birthDate,
        otherName: student.otherName ?? undefined,
        properties: student.properties ?? undefined,
      })),
    });
  }

  async processFile(id: string, file: ImportUpload): Promise<void> {
    try {
      const fileProcessor = this.#getFileProcessor(file);
      await this.#updateStatus(id, 'PROCESSING', {
        family: fileProcessor.name,
      });

      const students = this.prepare(fileProcessor);

      const mappedStudents = await this.#mapStudents(students);

      await this.#insertStudents(id, mappedStudents);

      await this.#updateStatus(id, 'DONE', {
        family: fileProcessor.name,
        initialCount: fileProcessor.getInitialCount(),
        mappedCount: mappedStudents.filter(student => student.studentId !== null).length,
        total: mappedStudents.length,
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
