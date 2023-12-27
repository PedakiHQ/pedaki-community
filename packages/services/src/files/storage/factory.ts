import { env } from '~/env.ts';
import type { Storage } from './storage.ts';

let storage: Storage | null = null;

export async function getStorage() {
  if (storage == null) {
    if (env.FILE_STORAGE == 's3') {
      const { S3Storage } = await import('./s3.storage.js');
      storage = new S3Storage();
    } else {
      const { LocalStorage } = await import('./local.storage.js');
      storage = new LocalStorage();
    }
  }
  return storage;
}
