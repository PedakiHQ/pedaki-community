import crypto from 'crypto';
import { env } from '~/env.ts';
import winston from 'winston';

const instanceId = crypto.randomBytes(8).toString('hex');

const { combine, json, colorize, cli } = winston.format;

export const logger = winston.createLogger({
  level: env.LOGGER_LEVEL,
  format: winston.format.combine(
    winston.format(info => {
      // Override service name
      info.scope = { name: '@pedaki' };
      info.instanceId = instanceId;

      if (typeof info.durationMs === 'number') {
        info.durationMS = info.durationMs;
        delete info.durationMs;
      }
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
