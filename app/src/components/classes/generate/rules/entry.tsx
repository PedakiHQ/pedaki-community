import type { LevelRuleType } from '@pedaki/algorithms/generate_classes/input';
import { Badge } from '@pedaki/design/ui/badge';
import { Button } from '@pedaki/design/ui/button';
import { Card } from '@pedaki/design/ui/card';
import { IconCircle, IconGripVertical2, IconTrash } from '@pedaki/design/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import { useRulesParams } from '~/components/classes/generate/parameters.tsx';
import { ruleMapping } from '~/components/classes/generate/rules/constants.ts';
import { DragHandle, SortableItem } from '~/components/dnd/SortableItem.tsx';
import React from 'react';
import classes from './entry.module.scss';

// TODO: rule type
const Entry = ({ item }: { item: { id: LevelRuleType } }) => {
  const mappedRule = ruleMapping[item.id];
  const [_, setRules] = useRulesParams();

  const removeRule = async () => {
    await setRules(oldRules => {
      if (!oldRules) {
        return [];
      }
      return oldRules.filter(rule => rule.id !== item.id);
    });
  };

  return (
    <SortableItem id={item.id}>
      <div className={classes.item}>
        <div className={classes.badge}>
          <IconCircle className="fill-stroke-soft text-stroke-soft" />
        </div>

        <Card className="ml-2 flex flex-1 flex-row justify-between">
          <div className="flex flex-col gap-2">
            <Badge
              className="-ml-1 text-sub-2xs uppercase"
              style={{
                backgroundColor: mappedRule.color,
              }}
            >
              {item.id}
            </Badge>
            <p className="text-label-sm text-sub">description</p>
          </div>

          <TooltipProvider>
            <div className="flex items-center justify-end gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost-error" size="icon" className="h-6 w-6 p-0">
                    <IconTrash className="h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent>
                    <span>Supprimer</span>
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <DragHandle className="focus-ring flex shrink-0 touch-none appearance-none items-center justify-center rounded-sm p-1 transition-all duration-200 hover:bg-weak">
                      <IconGripVertical2 className="h-6 text-soft " />
                    </DragHandle>
                  </span>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent className={classes.tooltip}>
                    <span>Déplacer</span>
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </div>
          </TooltipProvider>
        </Card>
      </div>
    </SortableItem>
  );
};

export default Entry;
