import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@pedaki/design/ui/button';
import { DialogFooter } from '@pedaki/design/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pedaki/design/ui/form';
import { IconMail } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import type { RuleMappingValue } from '~/components/classes/generate/rules/constants.ts';
import React from 'react';
import { useForm } from 'react-hook-form';

type Rule = {
  ruleMapping: RuleMappingValue;
  defaultValues?: unknown;
  onCanceled?: () => void;
  onDeleted?: () => void;
  onSaved?: (rule: RuleMappingValue) => void;
} & (
  | { onCanceled: () => void; onSaved: (rule: RuleMappingValue) => void }
  | { onDeleted: () => void }
);

const GenericRuleInput = ({ ruleMapping, defaultValues, onCanceled, onDeleted, onSaved }: Rule) => {
  const form = useForm({
    // resolver: zodResolver(newRuleType),
    mode: 'onChange',
    defaultValues: { defaultValues },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4"></form>
      </Form>

      <DialogFooter>
        {onCanceled && (
          <Button variant="stroke-primary-main" onClick={onCanceled} type="button">
            Retour
          </Button>
        )}
        {onDeleted && (
          <Button variant="stroke-danger-main" onClick={onDeleted} type="button">
            Supprimer
          </Button>
        )}
        {onSaved && (
          <Button variant="filled-primary" onClick={() => onSaved(ruleMapping)}>
            Enregistrer
          </Button>
        )}
      </DialogFooter>
    </div>
  );
};

export default GenericRuleInput;
