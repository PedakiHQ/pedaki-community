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
import { useHasChanged } from '~/app/[locale]/(main)/settings/useHasChanged.ts';
import { LocaleIcon } from '~/components/LanguageSelector/LocaleIcon.tsx';
import { useScopedI18n } from '~/locales/client';
import { locales, localesLabels } from '~/locales/shared.ts';
import { api } from '~/server/clients/client.ts';
import { useWorkspaceStore } from '~/store/workspace/workspace.store.ts';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
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
  const t = useScopedI18n('settings.general.rows.general.form');

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

  const setHasChanged = useHasChanged();

  function onSubmit(values: SettingsFormValues) {
    return wrapWithLoading(() => wait(changeSettingsMutation.mutateAsync(values), 200), {
      loadingProps: {
        title: t('submit.loading.title'),
        description: t('submit.loading.description'),
      },
      successProps: {
        title: t('submit.success.title'),
        description: t('submit.success.description'),
      },
      errorProps: _error => {
        return {
          title: t('submit.error.title'),
          description: t('submit.error.description'),
        };
      },
      throwOnError: true,
    })
      .then(() => {
        setHasChanged(false);
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
              <FormLabel>{t('fields.name.label')}</FormLabel>
              <FormControl>
                <Input
                  placeholder="shrek"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isSubmitting}
                  {...field}
                  onChange={e => {
                    setHasChanged(true);
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
                <FormDescription>{t('fields.name.description')}</FormDescription>
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
                <FormLabel>{t('fields.defaultLanguage.label')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('fields.defaultLanguage.placeholder')} />
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
                          {localesLabels[locale]}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage>
                  <FormDescription>{t('fields.defaultLanguage.description')}</FormDescription>
                </FormMessage>
              </FormItem>
            );
          }}
        />

        <div>
          <Button variant="filled-primary" type="submit" disabled={isSubmitting} size="sm">
            {isSubmitting && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
            {t('submit.label')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default GeneralForm;
