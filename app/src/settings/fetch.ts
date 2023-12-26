import { BASE_URL } from '~/server/clients/shared.ts';

export const fetchSettings = async () => {
  return (await fetch(`${BASE_URL}/api/settings`, {
    next: {
      revalidate: 5,
    },
  }).then(res => res.json())) as {
    name: string;
    defaultLanguage: string;
  };
};
