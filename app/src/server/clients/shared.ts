import { env } from '~/env';

const isLocal = env.NEXT_PUBLIC_PEDAKI_DOMAIN?.includes('localhost') || true;
export const BASE_URL = isLocal
  ? 'http://localhost:3000'
  : `https://${env.NEXT_PUBLIC_PEDAKI_DOMAIN}.pedaki.fr`;

export const getUrl = () => {
  return BASE_URL + '/api/t';
};
