import { logger } from '@pedaki/logger';
import { env } from '~/env.ts';
import type { CacheMechanism } from '~/files/cache/cache.ts';

const BASE_URL = 'https://api.cloudflare.com/client/v4';

export class CloudflareCache implements CacheMechanism {
  async clearCacheUrl(url: string) {
    logger.info(`CloudflareCache - Clearing cache for ${url}...`);

    const apiUrl = `${BASE_URL}/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      },
      body: JSON.stringify({
        files: [url],
      }),
    });

    const data = (await response.json()) as { success: boolean };
    if (!data.success) {
      throw new Error(`Error while clearing cache for ${url}: ${JSON.stringify(data)}`);
    }
  }
}
