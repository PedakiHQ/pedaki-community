import { logger } from '@pedaki/logger';
import { getFile } from '~/app/api/upload/utils.ts';
import { createContext } from '~api/router/context.ts';
import { appRouter } from '~api/router/router.ts';
import type { NextRequest } from 'next/server';
import { FILE_FIELD, FILE_MAX_SIZE, FILE_TYPES } from './constants.ts';

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
      sizeLimit: FILE_MAX_SIZE,
      allowedMimeTypes: FILE_TYPES,
      field: FILE_FIELD,
    });

    const buffer = await file.file.arrayBuffer();

    const caller = appRouter.createCaller(ctx);
    const response = await caller.students.imports.upload({
      mimeType: file.mimetype,
      buffer: buffer,
      name: file.fileName,
    });

    return Response.json(response);
  } catch (error) {
    logger.error('Failed to upload file', error);
    return new Response('Failed to upload logo', { status: 400 });
  }
}
