import { Button } from '@pedaki/design/ui/button';
import { IconBookUser, IconPlus } from '@pedaki/design/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import ConstraintsForm from '~/app/[locale]/(main)/classes/generate/ConstraintsForm.tsx';
import type { PageType } from '~/app/types.ts';
import ImportStudents from '~/components/classes/generate/ImportStudents.tsx';
import { GenerateClassesRulesWrapper } from '~/components/classes/generate/Wrapper.tsx';
import PageHeader from '~/components/PageHeader.tsx';
import StudentsListWrapper from '~/components/students/list/wrapper.tsx';
import type { LocaleCode } from '~/locales/server.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import React from 'react';
import { RulesInput } from './RulesInput';

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

      <div className="grid h-full grid-cols-5 pt-6" id={MAIN_CONTENT}>
        <div
          className={'col-span-2 flex flex-col justify-between justify-items-center border-r pr-6'}
        >
          <ConstraintsForm />
          <div className={'flex w-full'}>
            <StudentsListWrapper>
              <ImportStudents />
            </StudentsListWrapper>
          </div>
          <GenerateClassesRulesWrapper>
            <RulesInput />
          </GenerateClassesRulesWrapper>
        </div>
        <div className={'col-span-3 grid items-center justify-items-center'}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="filled-primary">
                  <IconPlus className="h-4 w-4" />
                  <span className="hidden @xl/main:inline">{t('output.generate.label')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('output.generate.label')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}
