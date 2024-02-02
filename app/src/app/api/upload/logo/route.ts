import { logger } from '@pedaki/logger';
import { LOGO_FIELD, LOGO_MAX_SIZE, LOGO_TYPES } from '~/app/api/upload/logo/constants.ts';
import { getFile } from '~/app/api/upload/utils.ts';
import { createContext } from '~api/router/context.ts';
import { appRouter } from '~api/router/router.ts';
import type { NextRequest } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  const ctx = await createContext({ req });
  if (!ctx.session?.user) {
    return new Response(
      JSON.stringify({
        message: 'UNAUTHORIZED',
      }),
      { status: 401 },
    );
  }
  // TODO: check permissions

  const formData = await req.formData();

  try {
    const file = getFile({
      form: formData,
      sizeLimit: LOGO_MAX_SIZE,
      allowedMimeTypes: LOGO_TYPES,
      field: LOGO_FIELD,
    });

    const buffer = await file.file.arrayBuffer();

    const favicon = await sharp(buffer).resize(32, 32).png().toBuffer();
    const logo = await sharp(buffer).resize(192, 192).png().toBuffer();

    const caller = appRouter.createCaller(ctx);
    const response = await caller.files.upload([
      {
        // SEE LOGO_URL in app/src/constants.ts
        name: 'logo-192x192',
        extension: 'png',
        buffer: logo,
        mimeType: file.mimetype,
        size: logo.byteLength,
        path: 'logo/',
        availability: 'public',
      },
      {
        // SEE FAVICON_URL in app/src/constants.ts
        name: 'favicon-32x32',
        extension: 'png',
        buffer: favicon,
        mimeType: file.mimetype,
        size: favicon.byteLength,
        path: 'logo/',
        availability: 'public',
      },
    ]);

    return Response.json(response);
  } catch (error) {
    logger.error('Failed to upload logo', error);
    return new Response('Failed to upload logo', { status: 400 });
  }
}
