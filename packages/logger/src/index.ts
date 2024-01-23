import crypto from 'crypto';
import * as api from '@opentelemetry/api';
import { env } from '~/env.ts';
import { VERSION } from '~/version.ts';
import winston from 'winston';

export const INSTANCE_ID = crypto.randomBytes(8).toString('hex'); // Used to identify a same instance in logs

const { combine, json, simple, errors } = winston.format;

const removeColors = winston.format(info => {
  if (info.message && typeof info.message === 'string') {
    info.message = info.message.replace(/\x1B\[\d+m/g, '');
  }
  return info;
});

const transports: winston.transport[] = [];

if (env.TRANSPORTERS.includes('file')) {
  transports.push(
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      silent: env.NODE_ENV === 'test',
      format: combine(removeColors(), json()),
    }),
  );
  transports.push(
    new winston.transports.File({
      level: 'info',
      filename: 'combined.log',
      silent: env.NODE_ENV === 'test',
      format: combine(removeColors(), json()),
    }),
  );
}

if (env.TRANSPORTERS.includes('console')) {
  transports.push(
    new winston.transports.Console({
      silent: env.NODE_ENV === 'test',
      format: winston.format.printf(info => {
        return info.message ? `${info.message}` : '';
      }),
    }),
  );
}

if (env.TRANSPORTERS.includes('other')) {
  // In production we are using a third party service to collect logs
}

export const logger = winston.createLogger({
  level: 'debug',
  defaultMeta: {
    service: {
      name: env.LOGGER_SERVICE_NAME,
      namespace: env.LOGGER_NAMESPACE,
      version: VERSION,
    },
    pedaki: {
      instanceId: INSTANCE_ID,
    },
  },
  format: combine(
    winston.format(info => {
      const span = api.trace.getActiveSpan();
      if (span) {
        info.spanId = span.spanContext().spanId;
        info.traceId = span.spanContext().traceId;
      }

      return info;
    })(),
    errors({ stack: true }),
    simple(),
  ),
  exitOnError: false,
  transports: transports,
  rejectionHandlers: transports,
  exceptionHandlers: transports,
});
