import { env } from '~/env';

export const getUrl = () => {
  return getBaseUrl() + '/api/t';
};

export const isLocal = () => {
  return env.NEXT_PUBLIC_PEDAKI_HOSTNAME === 'localhost';
};

export const getBaseUrl = () => {
  return isLocal() ? 'http://localhost:3000' : `https://${env.NEXT_PUBLIC_PEDAKI_HOSTNAME}`;
};
