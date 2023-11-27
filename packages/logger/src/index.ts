import crypto from 'crypto';
import * as api from '@opentelemetry/api';
import { env } from '~/env.ts';
import { VERSION } from '~/version.ts';
import winston from 'winston';

const instanceId = crypto.randomBytes(8).toString('hex');

const { combine, json, colorize, cli } = winston.format;

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
    json(),
  ),
  exitOnError: false,
  transports: [
    new winston.transports.Console({ level: 'debug', format: combine(colorize(), cli()) }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
