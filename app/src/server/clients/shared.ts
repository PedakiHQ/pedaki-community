import { env } from '~/env';

export const getUrl = () => {
  console.log('IN BASE_URL', getBaseUrl(), env.NEXT_PUBLIC_PEDAKI_HOSTNAME);
  return getBaseUrl() + '/api/t';
};

export const isLocal = () => {
  return env.NEXT_PUBLIC_PEDAKI_HOSTNAME === 'localhost';
};

export const getBaseUrl = () => {
  return isLocal() ? 'http://localhost:3000' : `https://${env.NEXT_PUBLIC_PEDAKI_HOSTNAME}`;
};
