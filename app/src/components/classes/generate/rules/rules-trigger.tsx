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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import { cn } from '@pedaki/design/utils';
import { useRulesParams } from '~/components/classes/generate/parameters.tsx';
import { ruleMapping } from '~/components/classes/generate/rules/constants.ts';
import type { RuleMappingValue } from '~/components/classes/generate/rules/constants.ts';
import GenericRuleInput from '~/components/classes/generate/rules/generic-rule-input.tsx';
import { useClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import React from 'react';

const BODY_CLASS = 'h-full overflow-y-auto py-8 px-4 relative block';

const RulesTrigger = () => {
  const [open, _setOpen] = React.useState(false);
  const setActiveCreateRule = useClassesGenerateStore(state => state.setActiveCreateRule);

  const setOpen = (open: boolean) => {
    open && setActiveCreateRule(null);
    _setOpen(open);
    if (!open) {
      setTimeout(() => {
        // Wait for the modal animation to finish
        setActiveCreateRule(null);
      }, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="stroke-primary-main" size="xs" className="flex items-center">
          <IconPlus className="h-4 text-soft" />
          {/*TODO: trads*/}
          <span className="pr-1 text-label-sm text-sub">Ajouter</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="block h-[80%] overflow-y-hidden md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          {/*TODO: trads*/}
          <DialogTitle>
            Choisir une règle
          </DialogTitle>
        </DialogHeader>
        <div className={BODY_CLASS}>
          <DialogBody setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DialogBody = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const activeCreateRule = useClassesGenerateStore(state => state.activeCreateRule);
  const setActiveCreateRule = useClassesGenerateStore(state => state.setActiveCreateRule);

  if (activeCreateRule) {
    return (
      <GenericRuleInput
        ruleMapping={ruleMapping[activeCreateRule]}
        onCanceled={() => setActiveCreateRule(null)}
        onSaved={() => setActiveCreateRule(null)}
      />
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(ruleMapping)
          .toSorted()
          .map(rule => (
            <RuleCard rule={rule} key={rule.key} setOpen={setOpen} />
          ))}
      </div>
    </TooltipProvider>
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
  const [rules, setRules] = useRulesParams();
  const setActiveCreateRule = useClassesGenerateStore(state => state.setActiveCreateRule);

  const canBeAddedResult = rule.canBeAdded(rules.map(r => r.key));
  const canBeAdded = canBeAddedResult === null;

  const addRule = async () => {
    setOpen(false);
    await setRules(oldRules => {
      if (!oldRules) {
        return [{ key: rule.key }];
      }
      return oldRules.concat({ key: rule.key });
    });
  };

  const handleCreateRule = async () => {
    if (!canBeAdded) return;
    if (rule.attributesCount === 'none') {
      await addRule();
      return;
    }
    setActiveCreateRule(rule.key);
  };

  return (
    <Tooltip open={canBeAdded ? false : undefined}>
      <TooltipTrigger asChild>
        <span className="w-full">
        <button key={rule.key} className={cn("focus-ring group rounded-lg p-0 w-full",
            !canBeAdded && 'cursor-not-allowed opacity-50',
            )}
        disabled={!canBeAdded}
                onClick={handleCreateRule}
        >
          <Card
            className='h-full p-0 transition-all duration-200'
            style={{
              backgroundColor: rule.color,
            }}
          >
            <div className="flex h-32 items-center justify-center transition-all group-focus-within:h-24 group-hover:h-24">
              <Icon className="m-auto h-12 w-12 text-main" />
            </div>
            <div className="h-16 rounded-b-lg border-t bg-white p-2 text-left transition-all group-focus-within:h-24 group-hover:h-24">
              <span className="text-p-md">{rule.key}</span>
              {/*TODO: trads*/}
              <p className="text-p-sm text-soft">description</p>
            </div>
          </Card>
        </button>
          </span>
      </TooltipTrigger>
      {/*TODO: trads*/}
      <TooltipContent>{!canBeAddedResult ? '-' : canBeAddedResult.join(',')}</TooltipContent>
    </Tooltip>
  );
};

export default RulesTrigger;
