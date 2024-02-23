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
import { useRulesParams } from '~/components/classes/generate/parameters.tsx';
import { ruleMapping } from '~/components/classes/generate/rules/constants.ts';
import type { RuleMappingValue } from '~/components/classes/generate/rules/constants.ts';
import React from 'react';

const RulesTrigger = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <div className="h-full overflow-y-auto py-8 pl-1 pr-4">
          <div className="grid grid-cols-3 gap-4">
            {Object.values(ruleMapping)
              .toSorted()
              .map(rule => (
                <RuleCard rule={rule} key={rule.key} setOpen={setOpen} />
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const RuleCard = ({
  rule,
  setOpen,
}: {
  rule: RuleMappingValue;
  setOpen: (open: boolean) => void;
}) => {
  const Icon = rule.icon;
  const [_, setRules] = useRulesParams();

  const addRule = async () => {
    setOpen(false);
    await setRules(oldRules => {
      if (!oldRules) {
        return [{ id: rule.key }];
      }
      return oldRules.concat({ id: rule.key });
    });
  };

  return (
    <button key={rule.key} className="focus-ring group rounded-lg p-0">
      <Card
        className="h-full p-0 transition-all duration-200"
        style={{
          backgroundColor: rule.color,
        }}
        onClick={addRule}
      >
        <div className="flex h-32 items-center justify-center transition-all group-focus-within:h-24 group-hover:h-24">
          <Icon className="m-auto h-12 w-12 text-main" />
        </div>
        <div className="h-16 rounded-b-lg border-t bg-white p-2 text-left transition-all group-focus-within:h-24 group-hover:h-24">
          <span className="text-p-md">{rule.key}</span>
          <p className="text-p-sm text-soft">description</p>
        </div>
      </Card>
    </button>
  );
};

export default RulesTrigger;
