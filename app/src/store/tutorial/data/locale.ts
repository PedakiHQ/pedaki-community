'use client';

import type { Locale } from 'react-joyride';

export const tutorialLocale = (locale: string): Locale => ({
  back: 'Back' + locale,
  close: 'Close' + locale,
  last: 'Close' + locale,
  next: 'Next' + locale,
  open: 'Open' + locale,
  skip: 'Skip' + locale,
});
