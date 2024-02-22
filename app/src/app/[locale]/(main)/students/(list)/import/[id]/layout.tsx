import { IconDownload } from '@pedaki/design/ui/icons';
import type { LayoutType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import { ImportNavigation } from '~/components/students/import/ImportNavigation.tsx';
import ValidateButton from '~/components/students/import/validate-button.tsx';
import { getScopedI18n } from '~/locales/server.ts';
import { api } from '~/server/clients/internal.ts';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function StudentsImportLayout({
  children,
  params,
}: LayoutType<{ id: string }>) {
  const t = await getScopedI18n('students.import');
  const id = params.id;

  const status = await api.students.imports.status.query({ id });

  if (status.status === 'ERROR') {
    return notFound();
  }

  return (
    <>
      <PageHeader
        title={t('header.title')}
        description={t('header.description')}
        icon={IconDownload}
      >
        <ValidateButton importId={id} />
      </PageHeader>

      <ImportNavigation importId={id} />
      <div className="h-full max-h-full @4xl:pt-6" id={MAIN_CONTENT}>
        {children}
      </div>
    </>
  );
}
