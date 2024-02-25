import type { RawAttribute, RuleType } from '@pedaki/algorithms';
import { Badge } from '@pedaki/design/ui/badge';
import { Button } from '@pedaki/design/ui/button';
import { Card } from '@pedaki/design/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@pedaki/design/ui/dialog';
import { IconCircle, IconGripVertical2, IconPencil, IconTrash } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import { ruleId, useRulesParams } from '~/components/classes/generate/parameters.tsx';
import { ruleMapping } from '~/components/classes/generate/rules/constants.ts';
import GenericRuleInput from '~/components/classes/generate/rules/generic-rule-input.tsx';
import { DragHandle, SortableItem } from '~/components/dnd/SortableItem.tsx';
import { DIALOG_BODY_CLASS } from '~/constants.ts';
import React from 'react';
import classes from './entry.module.scss';

interface EntryProps {
  item: { id: string; rule: RuleType; description: string };
  index: number | null;
}

const Description = ({ item }: EntryProps) => {
  const [description, _setDescription] = React.useState(item.description);
  const [_, setRules] = useRulesParams();

  const setDescription = (value: string) => {
    if (value.length > 24) return;
    _setDescription(value);
    void setRules(oldRules => {
      if (!oldRules) {
        return [];
      }
      return oldRules.map(oldRule => {
        if (ruleId(oldRule) === item.id) {
          oldRule.description = value;
        }
        return oldRule;
      });
    });
  };

  {
    /*TODO trads*/
  }
  return (
    <Input
      className="h-4 max-w-[24ch] overflow-hidden text-ellipsis rounded-sm border-transparent pl-0 text-label-sm text-sub"
      value={description}
      placeholder="Ajouter une description"
      maxLength={24}
      onChange={e => setDescription(e.target.value)}
    />
  );
};

// TODO: rule type
const Entry = ({ item, index }: EntryProps) => {
  const mappedRule = ruleMapping[item.rule];

  const hasAttributes = mappedRule.attributesCount !== 'none';

  return (
    <SortableItem id={item.id}>
      <div className={classes.item}>
        <div className={classes.badge}>
          <IconCircle className="fill-stroke-soft text-stroke-soft" />
        </div>

        <Card className="ml-2 flex flex-1 flex-row justify-between">
          <div className="flex flex-col gap-2">
            <Badge
              className="-ml-1 w-max text-sub-2xs uppercase"
              style={{
                backgroundColor: mappedRule.color,
              }}
            >
              {/*TODO: trads*/}
              {item.rule}
            </Badge>
            <Description item={item} index={index} />
          </div>

          <TooltipProvider>
            <div className="flex items-center justify-end gap-1">
              {!hasAttributes && <DeleteAction item={item} index={index} />}
              {hasAttributes && <EditAction item={item} index={index} />}

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
                    {/*TODO: trads*/}
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

const DeleteAction = ({ index }: EntryProps) => {
  const [_, setRules] = useRulesParams();

  const removeRule = async () => {
    await setRules(oldRules => {
      if (!oldRules) {
        return [];
      }
      return oldRules.filter((_, i) => i !== index);
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost-error" size="icon" className="h-6 w-6 p-0" onClick={removeRule}>
          <IconTrash className="h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          {/*TODO: trads*/}
          <span>Supprimer</span>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

const EditAction = ({ item }: EntryProps) => {
  const [open, setOpen] = React.useState(false);
  const [rules, setRules] = useRulesParams();

  const currentRule = rules?.find((r, i) => ruleId(r, i) === item.id);

  const onSubmitted = async (data: RawAttribute[]) => {
    await setRules(oldRules => {
      const value = { rule: item.rule, attributes: data };
      if (!oldRules) {
        return [value];
      }
      return oldRules.map(oldRule => {
        if (ruleId(oldRule) === item.id) {
          return value;
        }
        return oldRule;
      });
    });

    setOpen(false);
  };

  const deleteRule = async () => {
    await setRules(oldRules => {
      if (!oldRules) {
        return [];
      }
      return oldRules.filter(oldRule => {
        return ruleId(oldRule) !== item.id;
      });
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost-sub" size="icon" className="h-6 w-6 p-0">
                <IconPencil className="h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>
                {/*TODO: trads*/}
                <span>Editer</span>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </span>
      </DialogTrigger>

      <DialogContent
        className="block h-[80%] overflow-y-hidden md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          {/*TODO: trads*/}
          <DialogTitle>Editer une règle</DialogTitle>
        </DialogHeader>
        <div className={DIALOG_BODY_CLASS}>
          <GenericRuleInput
            defaultValues={currentRule?.attributes}
            ruleMapping={ruleMapping[item.rule]}
            onCanceled={() => setOpen(false)}
            onDeleted={deleteRule}
            onSaved={onSubmitted}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Entry;
