'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { RawAttribute, RawRule, RuleType } from '@pedaki/algorithms';
import {RawAttributeSchema, algorithmRules } from '@pedaki/algorithms';
import { Button } from '@pedaki/design/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@pedaki/design/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pedaki/design/ui/form';
import { IconPlus, IconTrash } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
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
        <div className={'flex flex-col items-start'}>
          <span>{t(params.rule.rule)}</span>
          <span className={'text-p-xs'}>
            {params.rule.attributes
              .map(attribute =>
                (attribute.options as string[])
                  // .concat(...(attribute.levels as number[]).map(level => `niveau ${level}`))
                  .concat(...(attribute.genders as string[]))
                  .concat(...(attribute.extras as string[]))
                  .join(', '),
              )
              .join(', ')
              .substring(0, 50)}
          </span>
        </div>
      </DialogTrigger>
      <Button
        variant="filled-neutral"
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
      <div>
        <div
          className={
            'flex aspect-square h-10 w-10 items-center justify-center rounded-full border bg-primary-base text-white'
          }
        >
          <IconPlus />
        </div>
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

interface AttributesProps {
  rule: RawRule;
  setAttribute: (index: number, attribute: RawAttribute) => void;
}

const AttributesInput = (params: AttributesProps) => {
  const [attributes, setAttributes] = useState(params.rule.attributes);

  return (
    <div>
      <div className={'flex flex-row'}>
        {attributes.map((attribute, i) => (
          <AttributeForm
            key={i}
            setAttribute={value => params.setAttribute(i, value)}
            attribute={attribute}
          />
        ))}
      </div>
      <button
        type={'button'}
        className={'rounded-lg border'}
        onClick={() => {
          setAttributes(attributes =>
            attributes.concat({
              options: [],
              levels: [],
              genders: [],
              extras: [],
            }),
          );
        }}
      >
        <IconPlus />
      </button>
    </div>
  );
};

const AttributeForm = (params: {
  attribute: RawAttribute;
  setAttribute: (attribute: RawAttribute) => void;
}) => {
  const form = useForm<RawAttribute>({
    resolver: zodResolver(z.array(RawAttributeSchema)),
    mode: 'onChange',
    defaultValues: params.attribute,
  });

  const handleFormSubmit = (value: RawAttribute) => {
    params.setAttribute(value);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex w-full flex-col justify-between"
      >
        <FormField
          control={form.control}
          name={'options'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Options</FormLabel>
              <FormControl>
                <Input
                  type="string"
                  {...field}
                  onChange={e => {
                    field.onChange(e.target);
                  }}
                />
              </FormControl>
              <FormMessage>
                <FormDescription>oui</FormDescription>
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'levels'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveaux</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => {
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormMessage>
                <FormDescription>oui</FormDescription>
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'genders'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genres</FormLabel>
              <FormControl>
                <Input
                  type="string"
                  {...field}
                  onChange={e => {
                    field.onChange(e.target);
                  }}
                />
              </FormControl>
              <FormMessage>
                <FormDescription>oui</FormDescription>
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'extras'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extras</FormLabel>
              <FormControl>
                <Input
                  type="string"
                  {...field}
                  onChange={e => {
                    field.onChange(e.target);
                  }}
                />
              </FormControl>
              <FormMessage>
                <FormDescription>oui</FormDescription>
              </FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export const RulesInput = () => {
  const [modalRule, setModalRule] = useState<number | undefined>();

  const { rules, newRule, deleteRule, setAttribute, setAttributes } = useGenerateClassesRulesStore(
    store => ({
      rules: store.rules,
      newRule: store.newRule,
      deleteRule: store.deleteRule,
      setAttribute: store.setAttribute,
      setAttributes: store.setAttributes,
    }),
  );

  return (
    <Dialog>
      <div className={'flex w-full flex-col gap-1'}>
        <NewRule onCreate={newRule} />
        {rules.map((rule, position) => (
          <Rule
            key={rule.rule}
            rule={rule}
            position={position + 1}
            onModal={() => setModalRule(position)}
            onDelete={() => deleteRule(position)}
          />
        ))}
      </div>
      <DialogContent
        className="max-h-[80%] md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <div className="w-full p-4">
          {modalRule !== undefined && (
            <AttributesInput
              rule={rules[modalRule]!}
              setAttribute={(attributePosition, attribute) =>
                setAttribute(modalRule, attributePosition, attribute)
              }
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
