import { Button } from '@pedaki/design/ui/button';
import { IconDownload } from '@pedaki/design/ui/icons';
import type { LayoutType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import { ImportNavigation } from '~/components/students/import/ImportNavigation.tsx';
import ValidateButton from '~/components/students/import/validate-button.tsx';
import { getScopedI18n } from '~/locales/server.ts';
import { api } from '~/server/clients/internal.ts';
import StoreProvider from '~/store/students/import/StoreProvider.tsx';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import Link from 'next/link';
import React from 'react';

export default async function StudentsImportLayout({
  children,
  params,
}: LayoutType<{ id: string }>) {
  const t = await getScopedI18n('students.import');
  const id = params.id;

  const [classMapping, levelMapping] = await Promise.all([
    api.classes.getMany.query(),
    api.classes.levels.getMany.query(),
  ]);

  return (
    <>
      <PageHeader
        title={t('header.title')}
        description={t('header.description')}
        icon={IconDownload}
      >
        <Button asChild>
          <Link href="/students">retour</Link>
        </Button>
        <ValidateButton />
      </PageHeader>
      <ImportNavigation importId={id} />
      <div className="h-full max-h-full pt-6" id={MAIN_CONTENT}>
        <StoreProvider classMapping={classMapping} levelMapping={levelMapping} importId={id}>
          {children}
        </StoreProvider>
      </div>
    </>
  );
}
