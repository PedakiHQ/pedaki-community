import { trace } from '@opentelemetry/api';
import { t } from '~api/router/init.ts';
import { flatten } from 'flat';

export const withTelemetry = t.middleware(async ({ rawInput, path, type, next }) => {
  const tracer = trace.getTracer('trpc');
  return tracer.startActiveSpan(`${path} - ${type}`, async span => {
    const result = await next();
    span.setAttributes(
      flatten({
        input: rawInput,
        path: path,
        type: type,
        ok: result.ok,
      }),
    );
    span.end();
    return result;
  });
});
