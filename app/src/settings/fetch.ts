import { env } from '~/env.ts';
import { fallbackLocale } from '~/locales/shared.ts';
import { getBaseUrl } from '~/server/clients/shared.ts';

export const fetchSettings = async () => {
  try {
    return (await fetch(`${getBaseUrl()}/api/settings`, {
      next: {
        revalidate: 5,
      },
    }).then(res => res.json())) as {
      name: string;
      defaultLanguage: string;
    };
  } catch (e) {
    return {
      name: env.NEXT_PUBLIC_PEDAKI_NAME,
      defaultLanguage: fallbackLocale,
    };
  }
};
