'use client';

import { Button } from '@pedaki/design/ui/button';
import { Card } from '@pedaki/design/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@pedaki/design/ui/dialog';
import { IconPlus } from '@pedaki/design/ui/icons';
import { ruleMapping } from '~/components/classes/generate/rules/constants.ts';
import React from 'react';

const RulesTrigger = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="stroke-primary-main" size="xs" className="flex items-center">
          <IconPlus className="h-4 text-soft" />
          <span className="pr-1 text-label-sm text-sub">Ajouter</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="block h-[80%] overflow-y-hidden md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Choisir une règle</DialogTitle>
        </DialogHeader>
        <div className="h-full overflow-y-auto py-8 pr-4">
          <div className="grid grid-cols-3 gap-4">
            {Object.values(ruleMapping)
              .toSorted()
              .map(rule => {
                const Icon = rule.icon;
                return (
                  <button key={rule.key} className="focus-ring p-0">
                    <Card
                      className="group h-full p-0 transition-all duration-200 hover:bg-weak"
                      style={{
                        backgroundColor: rule.color,
                      }}
                    >
                      <div className="flex h-32 items-center justify-center transition-all group-hover:h-24">
                        <Icon className="m-auto h-12 w-12 text-main" />
                      </div>
                      <div className="h-16 rounded-b-lg border-t bg-white p-2 text-left transition-all group-hover:h-24">
                        <span className="text-p-md">{rule.key}</span>
                        <p className="text-p-sm text-soft">description</p>
                      </div>
                    </Card>
                  </button>
                );
              })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RulesTrigger;
