'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import wait from '@pedaki/common/utils/wait';
import { wrapWithLoading } from '@pedaki/common/utils/wrap-with-loading';
import { Button } from '@pedaki/design/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pedaki/design/ui/form';
import { IconSpinner } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pedaki/design/ui/select';
import { WorkspacePropertiesSchema } from '@pedaki/services/workspace/workspace.model.js';
import { LocaleIcon } from '~/components/LanguageSelector/LocaleIcon.tsx';
import { locales } from '~/locales/shared.ts';
import { api } from '~/server/clients/client.ts';
import { useWorkspaceStore } from '~/store/workspace/workspace.store.ts';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';

const SettingsFormSchema = WorkspacePropertiesSchema.pick({
  name: true,
  defaultLanguage: true,
});
type SettingsFormValues = z.infer<typeof SettingsFormSchema>;

const GeneralForm = () => {
  const settings = useWorkspaceStore(state => state.settings);
  const updateSetting = useWorkspaceStore(state => state.updateSetting);
  const initialValues = useRef(settings);

  const changeSettingsMutation = api.settings.setSettings.useMutation();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: settings.name,
      defaultLanguage: settings.defaultLanguage,
    },
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
    return wrapWithLoading(() => wait(changeSettingsMutation.mutateAsync(values), 200), {
      loadingProps: {
        // TODO title and description
        title: "Création de l'invitation en cours",
      },
      successProps: {
        // TODO title and description
        title: '🎉 Invitation créée avec succès',
      },
      errorProps: error => {
        const title = "Une erreur est survenue lors de la création de l'invitation";
        return {
          title,
        };
      },
      throwOnError: true,
    })
      .then(() => {
        hasChanges.current = false;
        if (initialValues.current.defaultLanguage !== values.defaultLanguage) {
          window.location.reload();
        }
        initialValues.current = {
          ...initialValues.current,
          ...values,
        };
      })
      .catch(() => {
        // ignore
      });
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
                    // TODO: this double trigger is a hack to make sure that we only update the setting if the form is valid
                    void form.trigger('name').then(() => {
                      if (form.formState.errors.name) return;
                      updateSetting('name', e.target.value);
                    });
                  }}
                />
              </FormControl>
              <FormMessage>
                <FormDescription>blabla sidebar et onglets</FormDescription>
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultLanguage"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Langue de l&apos;application</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locales.map(locale => {
                      const Icon = LocaleIcon[locale];
                      return (
                        <SelectItem
                          key={locale}
                          value={locale}
                          icon={Icon}
                          iconProps={{
                            className: 'w-6 rounded-sm',
                          }}
                        >
                          {/*TODO: full name*/}
                          {locale}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage>
                  <FormDescription>Blabla uniquement celle de base</FormDescription>
                </FormMessage>
              </FormItem>
            );
          }}
        />

        <div>
          <Button variant="filled-primary" type="submit" disabled={isSubmitting} size="sm">
            {isSubmitting && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default GeneralForm;
