'use client';

import { Button } from '@pedaki/design/ui/button';
import { IconPlus, IconUpload } from '@pedaki/design/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import { useScopedI18n } from '~/locales/client.ts';
import { useIsSmall } from '~/utils.ts';
import Link from 'next/link';
import React from 'react';

const HeaderActions = () => {
  const isSmall = useIsSmall();
  const t = useScopedI18n('students.create');

  // TODO: handle container resize for tooltips (currently it's based on the window size but text is based on container size)

  return (
    <TooltipProvider>
      <Tooltip open={!isSmall ? false : undefined}>
        <TooltipTrigger asChild>
          <Button variant="filled-primary" asChild>
            <Link href="/students/create">
              <IconPlus className=" h-4 w-4" />
              <span className="hidden @xl:inline">{t('headerActions.submit')}</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('headerActions.submit')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HeaderActions;
