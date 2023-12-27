import fs from 'fs';
import { env } from '~/env.ts';
import type { FileUpload, FileUploadResult } from '~/files/file.model.ts';
import { prepareFile } from '~/files/storage/utils.ts';
import type { Storage } from './storage.ts';

export class LocalStorage implements Storage {
  uploadFile(rawFile: FileUpload): Promise<FileUploadResult> {
    const file = prepareFile(rawFile);

    const folder =
      file.availability === 'public'
        ? env.FILE_STORAGE_LOCAL_PUBLIC_PATH
        : env.FILE_STORAGE_LOCAL_PRIVATE_PATH;

    const key = `${file.path}${file.name}.${file.extension}`;

    // Docker base folder is /app
    fs.writeFileSync(`/app/${folder}/${key}`, Buffer.from(file.buffer));

    return Promise.resolve({
      name: file.name,
      mimeType: file.mimeType,
      size: file.size,
      altUrl: `https://${env.NEXT_PUBLIC_PEDAKI_HOSTNAME}/${key}`,
      url: `https://${env.NEXT_PUBLIC_PEDAKI_HOSTNAME}/${key}`,
      availability: file.availability,
    });
  }
}
