import { cache } from '@pedaki/common/cache';
import { CACHE_KEY } from '~/settings/constants.ts';
import { createContext } from '~api/router/context.ts';
import { appRouter } from '~api/router/router.ts';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const settings = await cache(async () => {
    const ctx = await createContext({ req });
    const caller = appRouter.createCaller(ctx);
    return await caller.workspace.getSettings();
  }, CACHE_KEY);

  return Response.json({
    name: settings.name,
    defaultLanguage: settings.defaultLanguage,
  });
}
