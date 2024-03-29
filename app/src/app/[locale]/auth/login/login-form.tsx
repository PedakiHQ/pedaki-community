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
import { IconLock, IconMail, IconSpinner } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import { StyledLink } from '@pedaki/design/ui/styled-link';
import { env } from '~/env.ts';
import { useScopedI18n } from '~/locales/client';
import { customErrorParams } from '~/locales/zod';
import { signIn } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// TODO: move this in a shared package
const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .refine(v => v.length >= 1, { params: customErrorParams('password.required') }),
});
type LoginFormValues = z.infer<typeof LoginFormSchema>;

const LoginForm = () => {
  const t = useScopedI18n('auth.login');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: env.NEXT_PUBLIC_IS_DEMO ? 'demo@pedaki.fr' : '',
      password: env.NEXT_PUBLIC_IS_DEMO ? 'demo' : '',
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(values: LoginFormValues) {
    return wrapWithLoading(
      async () => {
        await signIn('credentials', {
          email: values.email,
          password: values.password,
          callbackUrl: '/',
        });
      },
      {
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.email.label')}</FormLabel>
              <FormControl>
                <Input
                  icon={IconMail}
                  placeholder={t('fields.email.placeholder')}
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
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

        <Button variant="filled-primary" type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
          {t('submit.label')}
        </Button>

        <div className="flex items-center justify-between">
          <StyledLink
            href="/auth/forgot-password"
            className="text-p-xs"
            decoration="underline"
            variant="gray"
            prefetch={false}
          >
            {t('forgotPassword.label')}
          </StyledLink>
          <StyledLink
            href="/auth/register"
            className="text-p-xs"
            decoration="underline"
            variant="gray"
            prefetch={false}
          >
            {t('register.label')}
          </StyledLink>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
