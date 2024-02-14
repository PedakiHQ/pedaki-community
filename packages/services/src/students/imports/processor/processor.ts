import type { ImportClass, ImportClassLevel, ImportStudent } from '@prisma/client';
import type { ImportFamily, ImportUpload } from '~/students/imports/import.model.ts';
import { OndeProcessor } from '~/students/imports/processor/onde/onde.processor.ts';

export interface FileProcessor {
  name: ImportFamily;

  canProcess(file: ImportUpload): boolean;

  prepare(): void;

  getClassLevels(): ClassLevelImport[];

  getClasses(): ClassImport[];

  getStudents(): StudentImport[];
}

export const FILE_PROCESSORS = [OndeProcessor];

export type StudentImport = Omit<
  ImportStudent,
  'importId' | 'id' | 'studentId' | 'properties' | 'status'
> &
  Partial<Pick<ImportStudent, 'studentId'>> & {
    __importClassId?: number;
    __classHash: string;
  };

export type ClassImport = Omit<
  ImportClass,
  'importId' | 'id' | 'classId' | 'importLevelId' | 'status'
> &
  Partial<Pick<ImportClass, 'classId' | 'importLevelId'>> & {
    __rawLevel: string;
    __classHash: string;
    __importClassId?: number;
  };
export type ClassLevelImport = Omit<
  ImportClassLevel,
  'importId' | 'id' | 'classLevelId' | 'status'
> &
  Partial<Pick<ImportClassLevel, 'classLevelId'>>;
