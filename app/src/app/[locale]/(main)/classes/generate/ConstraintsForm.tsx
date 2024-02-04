'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pedaki/design/ui/form';
import { Input } from '@pedaki/design/ui/input';
import { useScopedI18n } from '~/locales/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const input = z.object({
  class_size_limit: z.number().gt(0),
  class_amount_limit: z.number().gt(0),
});
type FormValues = z.infer<typeof input>;

const ConstraintsForm = () => {
  const t = useScopedI18n('classes.generate.input.constraints');

  const form = useForm<FormValues>({
    resolver: zodResolver(input),
    mode: 'onChange',
    defaultValues: {
      class_size_limit: 30,
      class_amount_limit: 5,
    },
  });

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form className="flex flex-row gap-4">
        <FormField
          control={form.control}
          name="class_amount_limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('class_amount_limit.label')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  disabled={isSubmitting}
                  {...field}
                  onChange={e => {
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormMessage>
                <FormDescription>{t('class_amount_limit.description')}</FormDescription>
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="class_size_limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('class_size_limit.label')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  disabled={isSubmitting}
                  {...field}
                  onChange={e => {
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormMessage>
                <FormDescription>{t('class_size_limit.description')}</FormDescription>
              </FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ConstraintsForm;
