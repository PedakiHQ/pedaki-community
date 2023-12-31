'use client';

import { IconInfoCircleFill, IconX } from '@pedaki/design/ui/icons';
import { StyledLink } from '@pedaki/design/ui/styled-link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import { I18nProviderClient, useScopedI18n } from '~/locales/client';
import { useGlobalStore } from '~/store/global/global.store';
import React from 'react';

interface DemoBannerComponentProps {
  locale: string;
}

const DemoBannerComponent = ({ locale }: DemoBannerComponentProps) => {
  return (
    <I18nProviderClient locale={locale}>
      <DemoBannerComponentContent />
    </I18nProviderClient>
  );
};

const DemoBannerComponentContent = () => {
  const demoBannerVisible = useGlobalStore(state => state.demoBannerVisible);
  const setDemoBannerVisible = useGlobalStore(state => state.setDemoBannerVisible);
  const t = useScopedI18n('main.demoBanner');

  if (!demoBannerVisible) {
    return null;
  }

  return (
    <div className="peer" data-visible={demoBannerVisible}>
      <div className="fixed inset-x-0 z-[21] bg-weak">
        <div className="m-1 rounded-sm bg-surface px-4 py-2 text-white">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center justify-center gap-2">
              <IconInfoCircleFill className="hidden h-5 w-5 sm:block" />
              <p className="text-label-sm font-medium">{t('label')}</p>
              <p>∙</p>
              <p className="hidden text-p-sm lg:block">{t('description')}</p>
              <p className="hidden lg:block">∙</p>
              <StyledLink
                href="#"
                decoration="underline"
                variant="white"
                offset={2}
                className="text-p-sm font-medium ring-offset-neutral-700"
              >
                {t('button')}
              </StyledLink>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setDemoBannerVisible(false)}>
                    <IconX className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  {t('close')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBannerComponent;
