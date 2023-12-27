import { env } from '~/env.ts';
import type { CacheMechanism } from '~/files/cache/cache.ts';
import { NextjsCache } from './nextjs.cache.ts';

let cacheStrategies: CacheMechanism[] | null = null;

export async function getCache() {
  if (cacheStrategies == null) {
    cacheStrategies = [];
    if (env.CLOUDFLARE_ZONE_ID) {
      const { CloudflareCache } = await import('./cloudflare.cache.js');
      cacheStrategies.push(new CloudflareCache());
    }
    cacheStrategies.push(new NextjsCache());
  }

  return cacheStrategies;
}
