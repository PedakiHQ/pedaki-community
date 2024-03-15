import { trace } from '@opentelemetry/api';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { t } from '~api/router/init.ts';
import { flatten } from 'flat';

export const withTelemetry = t.middleware(async ({ getRawInput, path, type, next }) => {
  const tracer = trace.getTracer('trpc');
  return tracer.startActiveSpan(`${path} - ${type}`, async span => {
    const result = await next();

    let statusCode = 200;
    let stack = null;
    if (!result.ok) {
      statusCode = getHTTPStatusCodeFromError(result.error);
      stack = result.error.stack ?? null;
    }

    const rawInput = await getRawInput();

    span.setAttributes(
      flatten({
        input: rawInput,
        path: path,
        type: type,
        ok: result.ok,
        stack: stack,
        statusCode,
      }),
    );
    span.end();
    return result;
  });
});
