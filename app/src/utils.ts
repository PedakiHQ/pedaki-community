import { useMediaQuery } from '@pedaki/common/hooks/useMediaQuery';

export const useIsSmall = () => useMediaQuery('(max-width: 640px)');

export const isActive = (segment: string | null, path: string | null) => {
  if (path === null && segment === null) return true;
  if (path === null) return false;
  return segment == path || path.startsWith(`/${segment}`) || path === `/${segment ?? ''}`;
};
