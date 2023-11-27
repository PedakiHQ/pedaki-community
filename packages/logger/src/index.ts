import crypto from 'crypto';
import * as api from '@opentelemetry/api';
import { env } from '~/env.ts';
import { VERSION } from '~/version.ts';
import winston from 'winston';

const instanceId = crypto.randomBytes(8).toString('hex');

const { combine, json, simple } = winston.format;

const removeColors = winston.format(info => {
  if (info.message && typeof info.message === 'string') {
    info.message = info.message.replace(/\x1B\[\d+m/g, '');
  }
  return info;
});

export const logger = winston.createLogger({
  level: env.LOGGER_LEVEL,
  format: combine(
    winston.format(info => {
      const span = api.trace.getActiveSpan();
      if (span) {
        info.spanId = span.spanContext().spanId;
        info.traceId = span.spanContext().traceId;
      }

      info.instanceId = instanceId;
      info.version = VERSION;

      return info;
    })(),
    simple(),
  ),
  exitOnError: false,
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.printf(info => {
        return info.message ? `${info.message}` : '';
      }),
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: combine(removeColors(), json()),
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: combine(removeColors(), json()),
    }),
  ],
});
