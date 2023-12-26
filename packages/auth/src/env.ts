import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    AUTH_SECRET: z.string().min(2),

    NEXT_PUBLIC_PEDAKI_DOMAIN: z.string().default('localhost'), // without protocol

    PASSWORD_SALT: z.string().min(2),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
