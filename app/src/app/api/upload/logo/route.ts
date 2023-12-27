import { getFile } from '~/app/api/upload/utils.ts';
import { createContext } from '~api/router/context.ts';
import { appRouter } from '~api/router/router.ts';
import type { NextRequest } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  const ctx = await createContext({ req });
  if (!ctx.session?.user) {
    return Response.json({
      status: 401,
      statusText: 'UNAUTHORIZED',
    });
  }
  // TODO: check permissions

  const formData = await req.formData();

  try {
    const file = getFile({
      form: formData,
      sizeLimit: 1024 * 1024 * 10, // 10 MB
      allowedMimeTypes: ['image/jpeg', 'image/png'],
      field: 'file',
    });

    const buffer = await file.file.arrayBuffer();

    const favicon = await sharp(buffer).resize(32, 32).png().toBuffer();
    const logo = await sharp(buffer).resize(192, 192).png().toBuffer();

    const caller = appRouter.createCaller(ctx);
    const response = await caller.file.upload([
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
    return Response.json({
      status: 400,
      message: (error as Error).message,
    });
  }
}
