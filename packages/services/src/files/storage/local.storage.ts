import type { FileUpload, FileUploadResult } from '~/files/file.model.ts';
import type { Storage } from './storage.ts';

export class LocalStorage implements Storage {
  uploadFile(file: FileUpload): Promise<FileUploadResult> {
    return Promise.resolve({
      ...file,
      name: 'local-' + file.name,
      extension: 'local-' + file.extension,
      path: 'local-' + file.path,
    });
  }
}

const localStorage = new LocalStorage();
export { localStorage };
