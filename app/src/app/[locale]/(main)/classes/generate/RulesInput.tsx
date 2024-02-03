'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { algorithmRules } from '@pedaki/algorithms/input';
import type { RawRule, RuleType } from '@pedaki/algorithms/input';
import { Button } from '@pedaki/design/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@pedaki/design/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@pedaki/design/ui/form';
import { IconPlus, IconTrash } from '@pedaki/design/ui/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pedaki/design/ui/select';
import { useScopedI18n } from '~/locales/client';
import { useGenerateClassesRulesStore } from '~/store/classes/generate/rules.store';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface RuleProps {
  rule: RawRule;
  position: number;
  onModal: (event: any) => void; // TODO type
  onDelete: () => void;
}

const Rule = (params: RuleProps) => {
  const t = useScopedI18n('classes.generate.input.rules.types');

  // TODO tooltip
  return (
    <div className={'flex w-full flex-row justify-between rounded-lg border p-2'}>
      <DialogTrigger className={'flex w-full flex-row gap-6'} onClick={params.onModal}>
        <div
          className={
            'flex aspect-square h-10 w-10 items-center justify-center rounded-full border bg-neutral-300'
          }
        >
          {params.position}
        </div>
        {t(params.rule.rule)}
      </DialogTrigger>
      <Button
        variant="filled-error"
        size="icon"
        className="h-6 w-6 shrink-0 "
        onClick={params.onDelete}
      >
        <IconTrash className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface NewRuleProps {
  onCreate: (ruleType: RuleType) => void;
}

const newRuleType = z.object({ ruleType: z.enum(algorithmRules) });
type NewRuleFormValues = z.infer<typeof newRuleType>;

const NewRule = (params: NewRuleProps) => {
  const t = useScopedI18n('classes.generate.input.rules');

  const form = useForm<NewRuleFormValues>({
    resolver: zodResolver(newRuleType),
    mode: 'onChange',
    defaultValues: { ruleType: 'gather_attributes' },
  });

  const handleFormSubmit = (value: NewRuleFormValues) => {
    params.onCreate(value.ruleType);
  };

  return (
    <div className={'flex w-full flex-row gap-6 rounded-lg border p-2'}>
      <div
        className={
          'flex aspect-square h-10 w-10 items-center justify-center rounded-full border bg-primary-base text-white'
        }
      >
        <IconPlus />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex w-full flex-row justify-between"
        >
          <div className="">
            <FormField
              control={form.control}
              name="ruleType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={value => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('new.placeholder')} className="w-full">
                          {t(`types.${field.value}`)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {algorithmRules.map(ruleType => (
                          <SelectItem key={ruleType} value={ruleType}>
                            {t(`types.${ruleType}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="">
            <Button variant="filled-primary" size="sm" type="submit">
              {t('new.label')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export const RulesInput = () => {
  const [modalRule, setModalRule] = useState<number | undefined>();

  const { rules, newRule, deleteRule } = useGenerateClassesRulesStore(store => ({
    rules: store.rules,
    newRule: store.newRule,
    deleteRule: store.deleteRule,
  }));

  return (
    <Dialog>
      <div className={'flex w-full flex-col gap-1'}>
        {rules.map((rule, position) => (
          <Rule
            key={rule.rule}
            rule={rule}
            position={position}
            onModal={() => setModalRule(position)}
            onDelete={() => deleteRule(position)}
          />
        ))}
        <NewRule onCreate={newRule} />
      </div>
      <DialogContent
        className="max-h-[80%] md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <div className="w-full p-4">
          <p>Attributs de la règle n°{modalRule}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
