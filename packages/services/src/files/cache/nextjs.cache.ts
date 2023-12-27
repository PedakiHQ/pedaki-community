// import fs from 'fs/promises';
import { logger } from '@pedaki/logger';
import type { CacheMechanism } from '~/files/cache/cache.ts';

export class NextjsCache implements CacheMechanism {
  clearCacheUrl(url: string) {
    logger.info(`NextjsCache - Clearing cache for ${url}...`);
    logger.warn('NextjsCache - Clearing cache is not implemented yet.');

    // https://nextjs.org/docs/pages/api-reference/components/image#minimumcachettl
    // There is no mechanism to clear the cache for a specific image.
    // So we need to delete the cache folder.
    // const path = '/app/.next/cache/images';

    // await fs.rm(path, { recursive: true, force: true });
  }
}
