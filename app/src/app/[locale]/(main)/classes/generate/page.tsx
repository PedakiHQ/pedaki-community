import { IconBookUser } from '@pedaki/design/ui/icons';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import DrawerWrapper from '~/components/students/list/drawer-wrapper.tsx';
import StudentsListWrapper from '~/components/students/list/wrapper';
import { getScopedI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('classes.generate');

  return {
    title: t('metadata.title'),
  };
};

export default async function ClassesGeneratePage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('classes.generate');

  return (
    <>
      <PageHeader
        title={t('header.title')}
        description={t('header.description')}
        icon={IconBookUser}
      />

      <div className="h-full pt-6" id={MAIN_CONTENT}>
        <StudentsListWrapper>
          <DrawerWrapper />
        </StudentsListWrapper>
      </div>
    </>
  );
}
