import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    SECRET_PRIVATE_VARIABLE: z.string().min(2).default('default'),

    PASSWORD_SALT: z.string().min(2),

    LOGGER_SERVICE_NAME: z.string().default('pedaki'),

    API_INTERNAL_SECRET: z.string().min(2),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
