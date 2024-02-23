'use client';

import { Button } from '@pedaki/design/ui/button';
import { IconPlus } from '@pedaki/design/ui/icons';
import { Sheet, SheetContent, SheetTrigger } from '@pedaki/design/ui/sheet';
import React from 'react';

const RulesTrigger = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="stroke-primary-main" size="xs" className="flex items-center">
          <IconPlus className="h-4 text-soft" />
          <span className="pr-1 text-label-sm text-sub">Ajouter</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <div className="h-full pt-8"></div>
      </SheetContent>
    </Sheet>
  );
};

export default RulesTrigger;
