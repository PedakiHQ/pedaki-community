'use client';

import { Button } from '@pedaki/design/ui/button';
import { IconPlus, IconUpload } from '@pedaki/design/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import UploadStudentsFile from '~/app/[locale]/(main)/students/(list)/upload-students-file.tsx';
import { useScopedI18n } from '~/locales/client.ts';
import { useIsSmall } from '~/utils.ts';
import React from 'react';

const HeaderActions = () => {
  const isSmall = useIsSmall();
  const t = useScopedI18n('students.list');

  // TODO: handle container resize for tooltips (currently it's based on the window size but text is based on container size)

  return (
    <TooltipProvider>
      <Tooltip open={!isSmall ? false : undefined}>
        <TooltipTrigger asChild>
          <Button variant="stroke-primary-main" className="text-sub" disabled>
            <IconUpload className="h-4 w-4" />
            <span className="hidden @xl/main:inline">{t('headerActions.export.label')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('headerActions.export.label')}</TooltipContent>
      </Tooltip>
      <Tooltip open={!isSmall ? false : undefined}>
        <TooltipTrigger asChild>
          <UploadStudentsFile />
        </TooltipTrigger>
        <TooltipContent>{t('headerActions.import.label')}</TooltipContent>
      </Tooltip>
      <Tooltip open={!isSmall ? false : undefined}>
        <TooltipTrigger asChild>
          <Button variant="filled-primary" disabled>
            <IconPlus className=" h-4 w-4" />
            <span className="hidden @xl/main:inline">{t('headerActions.create.label')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('headerActions.create.label')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HeaderActions;
