'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { wrapWithLoading } from '@pedaki/common/utils/wrap-with-loading';
import { Button } from '@pedaki/design/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pedaki/design/ui/form';
import { IconSpinner } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import type { PageType } from '~/app/types.ts';
import { api } from '~/server/clients/client.ts';
import { useWorkspaceStore } from '~/store/workspace/workspace.store.ts';
import type { OutputType } from '~api/router/router.ts';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const SettingsFormSchema = z.object({
  name: z.string(), // TODO
});
type SettingsFormValues = z.infer<typeof SettingsFormSchema>;

export default function Page({ params }: PageType) {
  const { settings, updateSetting } = useWorkspaceStore(state => state);

  const changeSettingsMutation = api.workspace.setSettings.useMutation();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsFormSchema),
    mode: 'onChange',
    defaultValues: settings,
  });

  const { isSubmitting } = form.formState;

  function onSubmit(values: SettingsFormValues) {
    return wrapWithLoading(
      async () => {
        await changeSettingsMutation.mutateAsync(
          Object.entries(values).map(([k, v]) => ({
            key: k as keyof OutputType['workspace']['getSettings'],
            value: v,
          })),
        );
      },
      {
        loadingProps: null,
        successProps: null,
        errorProps: error => ({
          title: error.message,
        }),
        throwOnError: false,
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du workspace</FormLabel>
              <FormControl>
                <Input
                  placeholder="shrek"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isSubmitting}
                  {...field}
                  onChange={e => {
                    updateSetting('name', e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="filled-primary" type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
          Sauvegarder
        </Button>
      </form>
    </Form>
  );
}
