'use client';

import { IconInfoCircleFill, IconX } from '@pedaki/design/ui/icons';
import { StyledLink } from '@pedaki/design/ui/styled-link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import { useGlobalStore } from '~/store/global.store.ts';
import React from 'react';

const DemoBannerComponent = () => {
  const demoBannerVisible = useGlobalStore(state => state.demoBannerVisible);
  const setDemoBannerVisible = useGlobalStore(state => state.setDemoBannerVisible);

  if (!demoBannerVisible) {
    return null;
  }

  return (
    <div className="peer" data-visible={demoBannerVisible}>
      <div className="z-1 fixed inset-x-0 m-1 rounded-sm bg-surface px-4 py-2 text-white">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center justify-center gap-2">
            <IconInfoCircleFill className="hidden h-5 w-5 sm:block" />
            <p className="text-label-sm font-medium">Version de démonstration</p>
            <p>∙</p>
            <p className="hidden text-p-sm lg:block">Certaines fonctionnalités sont désactivées</p>
            <StyledLink
              href="#"
              decoration="underline"
              variant="white"
              offset={2}
              className="text-p-sm font-medium"
            >
              En savoir plus
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
                Fermer
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default DemoBannerComponent;
