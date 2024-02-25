import { env } from '~/env.ts';

export const FAVICON_URL = `${env.NEXT_PUBLIC_PUBLIC_FILES_HOST}/logo/favicon-32x32.png`; // Same as in next.config.js
export const LOGO_URL = `${env.NEXT_PUBLIC_PUBLIC_FILES_HOST}/logo/logo-192x192.png`;

export const DIALOG_BODY_CLASS = 'h-full overflow-y-auto py-8 px-4 relative block';
