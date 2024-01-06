import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    API_INTERNAL_SECRET: z.string(),
  },

  client: {
    NEXT_PUBLIC_TESTVALUE: z.string().default('testvalue'),
    NEXT_PUBLIC_IS_DEMO: z.coerce.boolean().default(false),
    NEXT_PUBLIC_PEDAKI_HOSTNAME: z.string().default('localhost'), // without protocol
    NEXT_PUBLIC_PEDAKI_VERSION: z.string().default('0.0.0'),
    NEXT_PUBLIC_PEDAKI_NAME: z.string().default('pedaki'),

    NEXT_PUBLIC_PUBLIC_FILES_HOST: z.string().default('http://localhost:3000'), // with protocol
    NEXT_PUBLIC_ENCRYPTED_FILES_HOST: z.string().default('http://localhost:3000'), // with protocol
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    API_INTERNAL_SECRET: process.env.API_INTERNAL_SECRET,

    NEXT_PUBLIC_TESTVALUE: process.env.NEXT_PUBLIC_TESTVALUE,
    NEXT_PUBLIC_IS_DEMO: process.env.NEXT_PUBLIC_IS_DEMO,
    NEXT_PUBLIC_PEDAKI_HOSTNAME: process.env.NEXT_PUBLIC_PEDAKI_HOSTNAME,
    NEXT_PUBLIC_PEDAKI_VERSION: process.env.NEXT_PUBLIC_PEDAKI_VERSION,
    NEXT_PUBLIC_PEDAKI_NAME: process.env.NEXT_PUBLIC_PEDAKI_NAME,
    NEXT_PUBLIC_PUBLIC_FILES_HOST: process.env.NEXT_PUBLIC_PUBLIC_FILES_HOST,
    NEXT_PUBLIC_ENCRYPTED_FILES_HOST: process.env.NEXT_PUBLIC_ENCRYPTED_FILES_HOST,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
