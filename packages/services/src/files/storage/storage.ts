import type { FileUpload, FileUploadResult } from '~/files/file.model.ts';

export interface Storage {
  /**
   * Upload a file to the storage
   */
  uploadFile(file: FileUpload): Promise<FileUploadResult>;
}
