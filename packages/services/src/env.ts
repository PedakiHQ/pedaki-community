import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    PASSWORD_SALT: z.string().min(2),

    RESEND_API_KEY: z.string(),
    RESEND_EMAIL_DOMAIN: z.string(),

    NEXT_PUBLIC_PEDAKI_HOSTNAME: z.string().default('localhost'), // without protocol
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
