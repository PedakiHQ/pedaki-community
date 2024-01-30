import type { ImportStudent } from '@prisma/client';
import type { ImportFamily, ImportUpload } from '~/students/imports/import.model.ts';
import { SiecleProcessor } from '~/students/imports/processor/siecle/siecle.processor.ts';

export interface FileProcessor {
  name: ImportFamily;
  canProcess(file: ImportUpload): boolean;
  prepare(): StudentImport[];
  getInitialCount(): number;
}

export const FILE_PROCESSORS = [SiecleProcessor];

export type StudentImport = Omit<ImportStudent, 'importId' | 'id' | 'studentId' | 'properties'> &
  Partial<Pick<ImportStudent, 'studentId'>> & {
    properties: Record<string, any>;
  };
