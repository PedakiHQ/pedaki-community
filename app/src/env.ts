import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },

  client: {
    NEXT_PUBLIC_TESTVALUE: z.string().default('testvalue'),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    NEXT_PUBLIC_TESTVALUE: process.env.NEXT_PUBLIC_TESTVALUE,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
