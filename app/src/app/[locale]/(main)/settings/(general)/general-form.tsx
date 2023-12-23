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
import { dictToSettings } from '~/app/[locale]/(main)/settings/(general)/utils.ts';
import { api } from '~/server/clients/client.ts';
import { useWorkspaceStore } from '~/store/workspace/workspace.store.ts';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const SettingsFormSchema = z.object({
  name: z.string().max(25), // TODO
  email: z.string().email(),
});
type SettingsFormValues = z.infer<typeof SettingsFormSchema>;

const GeneralForm = () => {
  const settings = useWorkspaceStore(state => state.settings);
  const updateSetting = useWorkspaceStore(state => state.updateSetting);

  const changeSettingsMutation = api.workspace.setSettings.useMutation();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsFormSchema),
    mode: 'onChange',
    defaultValues: settings,
  });

  const { isSubmitting } = form.formState;

  const hasChanges = React.useRef(false);

  useEffect(() => {
    return () => {
      if (hasChanges.current) {
        toast.warning("Les changements n'ont pas été sauvegardés.", {
          id: 'settings-unsaved-changes',
        });
      }
    };
  }, []);

  function onSubmit(values: SettingsFormValues) {
    return wrapWithLoading(
      async () => {
        await changeSettingsMutation.mutateAsync(dictToSettings(values)).then(() => {
          hasChanges.current = false;
        });
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
                    hasChanges.current = true;
                    field.onChange(e);
                    if (form.formState.isValid) {
                      updateSetting('name', e.target.value);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email de contact</FormLabel>
              <FormControl>
                <Input
                  placeholder="shrek"
                  type="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isSubmitting}
                  {...field}
                  onChange={e => {
                    hasChanges.current = true;
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button variant="filled-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneralForm;
