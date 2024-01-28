import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    PASSWORD_SALT: z.string().min(2),

    RESEND_API_KEY: z.string(),
    RESEND_EMAIL_DOMAIN: z.string(),

    NEXT_PUBLIC_PEDAKI_HOSTNAME: z.string().default('localhost'), // without protocol

    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_SESSION_TOKEN: z.string().optional(),

    FILE_STORAGE: z.enum(['local', 's3']).default('local'),

    FILE_STORAGE_LOCAL_PUBLIC_PATH: z.string().optional(),
    FILE_STORAGE_LOCAL_PRIVATE_PATH: z.string().optional(),

    FILE_STORAGE_S3_REGION: z.string().optional(),
    FILE_STORAGE_S3_PUBLIC_BUCKET: z.string().optional(),
    FILE_STORAGE_S3_PRIVATE_BUCKET: z.string().optional(),
    FILE_STORAGE_S3_PREFIX: z.string().optional(),

    CLOUDFLARE_ZONE_ID: z.string().optional(),
    CLOUDFLARE_API_TOKEN: z.string().optional(),

    SKIP_ENV_VALIDATION: z.boolean().optional(),
    SKIP_DB_CALLS: z.boolean().optional(),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
