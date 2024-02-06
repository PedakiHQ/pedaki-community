import type { ImportClass, ImportClassLevel, ImportStudent } from '@prisma/client';
import type { ImportFamily, ImportUpload } from '~/students/imports/import.model.ts';
import { SiecleProcessor } from '~/students/imports/processor/siecle/siecle.processor.ts';

export interface FileProcessor {
  name: ImportFamily;

  canProcess(file: ImportUpload): boolean;

  prepare(): void;

  getClassLevels(): ClassLevelImport[];

  getClasses(): ClassImport[];

  getStudents(): StudentImport[];
}

export const FILE_PROCESSORS = [SiecleProcessor];

export type StudentImport = Omit<
  ImportStudent,
  'importId' | 'id' | 'studentId' | 'properties' | 'status'
> &
  Partial<Pick<ImportStudent, 'studentId'>>;

export type ClassImport = Omit<
  ImportClass,
  'importId' | 'id' | 'classId' | 'importLevelId' | 'status'
> &
  Partial<Pick<ImportClass, 'classId' | 'importLevelId'>> & {
    _rawLevel: string;
  };
export type ClassLevelImport = Omit<
  ImportClassLevel,
  'importId' | 'id' | 'classLevelId' | 'status'
> &
  Partial<Pick<ImportClassLevel, 'classLevelId'>>;
