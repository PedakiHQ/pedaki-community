import type { PageType } from '~/app/types.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import React from 'react';

export default async function StudentsImportStudentsPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.import');

  return <></>;
}
