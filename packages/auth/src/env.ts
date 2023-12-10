import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    AUTH_SECRET: z.string().min(2),

    PEDAKI_DOMAIN: z.string().min(2),

    PASSWORD_SALT: z.string().min(2),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
