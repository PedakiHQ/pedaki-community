import { useMediaQuery } from '@pedaki/common/hooks/useMediaQuery';

export const useIsSmall = () => useMediaQuery('(max-width: 640px)');

export const isActive = (segment: string | null, path: string | null) => {
  if (path === null && segment === null) return true;
  if (path === null) return false;
  return segment == path || path.startsWith(`/${segment}`) || path === `/${segment ?? ''}`;
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
