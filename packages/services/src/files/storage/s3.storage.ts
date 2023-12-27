import type { FileUpload, FileUploadResult } from '~/files/file.model.ts';
import type { Storage } from './storage.ts';

export class S3Storage implements Storage {
  uploadFile(file: FileUpload): Promise<FileUploadResult> {
    return Promise.resolve({
      ...file,
      name: 's3-' + file.name,
      extension: 's3-' + file.extension,
      path: 's3-' + file.path,
    });
  }
}

const s3Storage = new S3Storage();
export { s3Storage };
