import { trace } from '@opentelemetry/api';
import { env } from '~api/env.ts';
import { t } from '~api/router/init.ts';
import { flatten } from 'flat';

export const withTelemetry = t.middleware(async ({ rawInput, path, type, ctx, next }) => {
  const tracer = trace.getTracer('trpc');
  return tracer.startActiveSpan(`${path} - ${type}`, async span => {
    const result = await next();
    span.setAttributes(
      flatten({
        input: rawInput,
        path: path,
        type: type,
        ok: result.ok,
        service: {
          name: env.LOGGER_SERVICE_NAME,
          namespace: env.LOGGER_SERVICE_NAME,
        },
      }),
    );
    span.end();
    return result;
  });
});