'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pedaki/design/ui/form';
import { Input } from '@pedaki/design/ui/input';
import { useConfigurationParams } from '~/components/classes/generate/parameters.tsx';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  class_size_limit: z.number().int().positive(),
  class_amount_limit: z.number().int().positive(),
});
type FormValues = z.infer<typeof FormSchema>;

const ConfigFields = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      class_size_limit: 30,
      class_amount_limit: 6,
    },
  });

  const preventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const parseValue = (value: string) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 0 : Math.max(parsed, 0);
  };

  const [_, setConfig] = useConfigurationParams();

  return (
    <Form {...form}>
      <form onSubmit={preventSubmit} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="class_size_limit"
          render={({ field }) => (
            <FormItem>
              {/*TODO: trads*/}
              <FormLabel>Nombre de classes maximum</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={e => {
                    const value = parseValue(e.target.value);
                    field.onChange(value);
                    void setConfig(config => ({ count: config?.count ?? 30, size: value }));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="class_amount_limit"
          render={({ field }) => (
            <FormItem>
              {/*TODO: trads*/}
              <FormLabel>Taille des classes maximum</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={e => {
                    const value = parseValue(e.target.value);
                    field.onChange(value);
                    void setConfig(config => ({ count: value, size: config?.size ?? 6 }));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ConfigFields;
