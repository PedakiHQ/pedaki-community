import { Button } from '@pedaki/design/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { IconChevronDown, IconTranslation } from '@pedaki/design/ui/icons';
import { locales } from '~/locales/shared';
import React, { Suspense } from 'react';
import { LocaleItem } from './LocaleItem';

const LanguageSelector = () => {
  // const languageT = await getScopedI18n('components.footer.language');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group" asChild>
        <Button
          variant="stroke-primary-gray"
          // aria-label={languageT('change')}
          className="text-main"
        >
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <IconTranslation className="h-4 w-4" />
              {/*<span className="hidden md:inline">{languageT('change')}</span>*/}
            </div>
            <div className="relative top-[1px] ml-1 w-max transition duration-100 group-data-[state=open]:rotate-180">
              <IconChevronDown className="h-4 w-4" />
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top">
        {locales.map(locale => {
          return (
            <Suspense key={locale}>
              <LocaleItem locale={locale} />
            </Suspense>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
