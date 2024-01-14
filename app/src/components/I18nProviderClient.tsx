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
      <I18nProviderClientContent>{children}</I18nProviderClientContent>
    </OriginalI18nProviderClient>
  );
}

function I18nProviderClientContent({ children }: { children: React.ReactNode }) {
  const tZod = useScopedI18n('zod');
  const zodErrorMap = getZodErrorMap(tZod);
  z.setErrorMap(zodErrorMap);

  return children;
}
