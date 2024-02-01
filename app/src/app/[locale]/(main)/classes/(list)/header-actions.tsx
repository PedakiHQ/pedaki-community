'use client';

import { Button } from '@pedaki/design/ui/button';
import { IconPlus } from '@pedaki/design/ui/icons';
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
  const t = useScopedI18n('classes.list');

  return (
    <TooltipProvider>
      <Tooltip open={!isSmall ? false : undefined}>
        <TooltipTrigger asChild>
          <Button variant="filled-primary">
            <IconPlus className=" h-4 w-4" />
            <span className="hidden @xl/main:inline">{t('headerActions.generate.label')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('headerActions.generate.label')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HeaderActions;
