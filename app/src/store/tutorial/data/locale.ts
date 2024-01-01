'use client';

import type { useScopedI18n } from '~/locales/client';
import type { Locale } from 'react-joyride';

export const tutorialLocale = (t: ReturnType<typeof useScopedI18n<'tutorial'>>): Locale => ({
  back: t('main.locales.back'),
  close: t('main.locales.close'),
  last: t('main.locales.last'),
  next: t('main.locales.next'),
  open: t('main.locales.open'),
  skip: t('main.locales.skip'),
});
