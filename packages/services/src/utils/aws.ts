import { S3Client } from '@aws-sdk/client-s3';
import { env } from '~/env.ts';

const config = {
  region: env.FILE_STORAGE_S3_REGION!,
} as Record<string, any>;

if (env.NODE_ENV == 'development') {
  config.credentials = {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: env.AWS_SESSION_TOKEN!,
  };
}

export const s3Client = env.FILE_STORAGE == 's3' ? new S3Client(config) : null;
