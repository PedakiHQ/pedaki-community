'use client';

import { I18nProviderClient as OriginalI18nProviderClient, useScopedI18n } from '~/locales/client';
import { getZodErrorMap } from '~/locales/zod';
import { z } from 'zod';

export default function I18nProviderClient({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <OriginalI18nProviderClient locale={locale}>
      <SetZodErrorMap />
      {children}
    </OriginalI18nProviderClient>
  );
}

function SetZodErrorMap() {
  const tZod = useScopedI18n('zod');
  const zodErrorMap = getZodErrorMap(tZod);
  z.setErrorMap(zodErrorMap);

  return null;
}
