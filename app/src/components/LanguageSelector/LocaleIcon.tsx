import { IconFlagFR, IconFlagGB } from '@pedaki/design/ui/icons';
import type { IconType } from '@pedaki/design/ui/icons';
import type { LocaleCode } from '~/locales/server.ts';

export const LocaleIcon: Record<LocaleCode, IconType> = {
  fr: IconFlagFR,
  en: IconFlagGB,
};
