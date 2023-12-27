import { getFile } from '~/app/api/upload/utils.ts';
import { createContext } from '~api/router/context.ts';
import { appRouter } from '~api/router/router.ts';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const ctx = await createContext({ req });
  if (!ctx.session?.user) {
    return Response.json({
      status: 401,
      statusText: 'UNAUTHORIZED',
    });
  }

  const formData = await req.formData();

  try {
    const file = getFile({
      form: formData,
      sizeLimit: 1024 * 1024 * 10, // 10 MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
      field: 'file',
    });

    const buffer = await file.file.arrayBuffer();

    const caller = appRouter.createCaller(ctx);
    const response = await caller.file.upload([
      {
        name: file.fileName,
        buffer: buffer,
        mimeType: file.mimetype,
        size: file.size,
        availability: 'public',
      },
    ]);

    return Response.json(response);
  } catch (error) {
    return Response.json({
      status: 400,
      statusText: (error as Error).message,
    });
  }
}
