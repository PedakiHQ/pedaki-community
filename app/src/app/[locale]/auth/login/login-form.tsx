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
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// TODO: move this in a shared package
const LoginFormSchema = z.object({
  email: z
    .string({ required_error: "L'adresse email est requise" })
    .email("L'adresse email n'est pas valide"),
  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});
type LoginFormValues = z.infer<typeof LoginFormSchema>;

const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    mode: 'onChange',
    defaultValues: {
      // TODO: remove this
      email: 'test@email.com',
      password: 'test123456789',
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
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
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
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
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
          <div className="grid gap-2">
            <Button disabled={isSubmitting} className="mt-2" variant="neutral">
              {isSubmitting && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
          <span className="text-secondary">Vous n&apos;avez pas de compte ?</span>{' '}
          <Link href="/auth/register" className="text-orange">
            S&apos;inscrire
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
