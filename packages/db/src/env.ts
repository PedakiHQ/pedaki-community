import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    DATABASE_URL: z.string().url(),
    PRISMA_ENCRYPTION_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
});
