import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    LOGGER_NAMESPACE: z.string().default('community'),
    LOGGER_SERVICE_NAME: z.string().default('pedaki'),

    TRANSPORTERS: z.enum(['console', 'other', 'otlp', 'file']).array().default(['console']),

    OTLP_ENDPOINT: z.string().optional(),
    OTLP_HEADERS: z
      .string()
      .transform(value => {
        if (!value) return {};
        return JSON.parse(value) as Record<string, string>;
      })
      .optional(),
  },
  runtimeEnv: process.env,
});
