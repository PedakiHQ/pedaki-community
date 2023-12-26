import { getBaseUrl } from '~/server/clients/shared.ts';

export const fetchSettings = async () => {
  return (await fetch(`${getBaseUrl()}/api/settings`, {
    next: {
      revalidate: 5,
    },
  }).then(res => res.json())) as {
    name: string;
    defaultLanguage: string;
  };
};
