'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import wait from '@pedaki/common/utils/wait';
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
import { IconLock, IconSpinner } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import { useScopedI18n } from '~/locales/client';
import { customErrorParams } from '~/locales/zod';
import { api } from '~/server/clients/client.ts';
import { signIn } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// TODO: move this in a shared package
const ActivateAccountForm = z
  .object({
    password: z
      .string()
      .refine(v => v.length >= 1, { params: customErrorParams('password.required') })
      .refine(v => v.length >= 8, { params: customErrorParams('password.min', { count: 8 }) }),
    passwordConfirm: z
      .string()
      .refine(v => v.length >= 1, { params: customErrorParams('passwordConfirm.required') })
      .refine(v => v.length >= 8, { params: customErrorParams('password.min', { count: 8 }) }),
  })
  .refine(data => data.password === data.passwordConfirm, {
    params: customErrorParams('passwordConfirm.unmatched'),
    path: ['passwordConfirm'],
  });
type ActivateAccountFormValues = z.infer<typeof ActivateAccountForm>;

interface ActivateFormProps {
  email: string;
  token: string;
}

const ActivateForm = ({ email, token }: ActivateFormProps) => {
  const t = useScopedI18n('auth.activate');

  const form = useForm<ActivateAccountFormValues>({
    resolver: zodResolver(ActivateAccountForm),
    mode: 'onChange',
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  const { isSubmitting } = form.formState;

  const activateAccountMutation = api.auth.activateAccount.useMutation();

  function onSubmit(values: ActivateAccountFormValues) {
    return wrapWithLoading(
      () =>
        wait(
          activateAccountMutation.mutateAsync({
            email: email,
            password: values.password,
            token: token,
          }),
          200,
        ),
      {
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
      },
    )
      .then(async () => {
        await signIn('credentials', {
          email: email,
          password: values.password,
          callbackUrl: '/',
        });
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.password.label')}</FormLabel>
              <FormControl>
                <Input
                  icon={IconLock}
                  placeholder="********"
                  type="password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.passwordConfirm.label')}</FormLabel>
              <FormControl>
                <Input
                  icon={IconLock}
                  placeholder="********"
                  type="password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="filled-primary" type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
          {t('submit.label')}
        </Button>
      </form>
    </Form>
  );
};

export default ActivateForm;
