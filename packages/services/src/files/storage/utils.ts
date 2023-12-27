import { generateToken } from '@pedaki/common/utils/random';
import type { FileUpload } from '~/files/file.model.ts';
import mime from 'mime-types';

export const prepareFile = (file: FileUpload) => {
  const fileName = file.name ?? generateToken(32);
  const extension = file.extension ?? (mime.extension(file.mimeType) || 'bin');

  return {
    ...file,
    name: fileName,
    extension: extension,
    path: file.path ?? '',
  };
};
