import crypto from 'crypto';
import * as api from '@opentelemetry/api';
import { env } from '~/env.ts';
import { VERSION } from '~/version.ts';
import winston from 'winston';

export const INSTANCE_ID = crypto.randomBytes(8).toString('hex');

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

      // Meta data
      info.service = {
        name: env.LOGGER_SERVICE_NAME,
        namespace: env.LOGGER_NAMESPACE,
        version: VERSION,
      };
      info.pedaki = {
        instanceId: INSTANCE_ID,
        community: true,
      };

      return info;
    })(),
    simple(),
  ),
  exitOnError: false,
  transports: [
    new winston.transports.Console({
      level: 'info',
      silent: env.NODE_ENV === 'test',
      format: winston.format.printf(info => {
        return info.message ? `${info.message}` : '';
      }),
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      silent: env.NODE_ENV === 'test',
      format: combine(removeColors(), json()),
    }),
    new winston.transports.File({
      filename: 'combined.log',
      silent: env.NODE_ENV === 'test',
      format: combine(removeColors(), json()),
    }),
  ],
});
