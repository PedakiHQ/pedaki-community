import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },

  client: {
    NEXT_PUBLIC_TESTVALUE: z.string().default('testvalue'),
    NEXT_PUBLIC_IS_DEMO: z.coerce.boolean().default(false),
    NEXT_PUBLIC_PEDAKI_DOMAIN: z.string(),
    NEXT_PUBLIC_PEDAKI_VERSION: z.string(),
    NEXT_PUBLIC_PEDAKI_NAME: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    NEXT_PUBLIC_TESTVALUE: process.env.NEXT_PUBLIC_TESTVALUE,
    NEXT_PUBLIC_IS_DEMO: process.env.NEXT_PUBLIC_IS_DEMO,
    NEXT_PUBLIC_PEDAKI_DOMAIN: process.env.NEXT_PUBLIC_PEDAKI_DOMAIN,
    NEXT_PUBLIC_PEDAKI_VERSION: process.env.NEXT_PUBLIC_PEDAKI_VERSION,
    NEXT_PUBLIC_PEDAKI_NAME: process.env.NEXT_PUBLIC_PEDAKI_NAME,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
