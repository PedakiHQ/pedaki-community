import { useMediaQuery } from '@pedaki/common/hooks/useMediaQuery';

export const useIsSmall = () => useMediaQuery('(max-width: 640px)');
