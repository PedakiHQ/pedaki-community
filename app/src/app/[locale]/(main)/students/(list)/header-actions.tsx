'use client';

import { Button } from '@pedaki/design/ui/button';
import { IconDownload, IconPlus, IconUpload } from '@pedaki/design/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import { useScopedI18n } from '~/locales/client.ts';
import { useIsSmall } from '~/utils.ts';
import React from 'react';

const HeaderActions = () => {
  const isSmall = useIsSmall();
  const t = useScopedI18n('students.list');

  return (
    <TooltipProvider>
      <Tooltip open={!isSmall ? false : undefined}>
        <TooltipTrigger asChild>
          <Button variant="stroke-primary-main" className="text-sub">
            <IconUpload className="h-4 w-4" />
            <span className="hidden @xl/main:inline">{t('headerActions.export.label')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('headerActions.export.label')}</TooltipContent>
      </Tooltip>
      <Tooltip open={!isSmall ? false : undefined}>
        <TooltipTrigger asChild>
          <Button variant="stroke-primary-main" className="text-sub">
            <IconDownload className="h-4 w-4" />
            <span className="hidden @xl/main:inline">{t('headerActions.import.label')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('headerActions.import.label')}</TooltipContent>
      </Tooltip>
      <Tooltip open={!isSmall ? false : undefined}>
        <TooltipTrigger asChild>
          <Button variant="filled-primary">
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
