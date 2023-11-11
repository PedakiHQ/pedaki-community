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
import { IconGoogle, IconSpinner } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import { api } from '~/server/clients/client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// TODO: move this in a shared package
const LoginFormSchema = z
  .object({
    email: z
      .string({ required_error: "L'adresse email est requise" })
      .email("L'adresse email n'est pas valide"),
    password: z
      .string({ required_error: 'Le mot de passe est requis' })
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    name: z.string({ required_error: 'Le nom est requis' }),
  })
  .extend({
    confirm_password: z.string(),
  })
  .refine(data => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Les mots de passe ne correspondent pas',
  });

type LoginFormValues = z.infer<typeof LoginFormSchema>;

export function SignupForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    mode: 'onChange',
    defaultValues: {
      // TODO: remove this
      email: 'test@email.com',
      password: 'test123456789',
      confirm_password: 'test123456789',
      name: 'test',
    },
  });
  const { isSubmitting } = form.formState;

  const [providerLoading, setProviderLoading] = React.useState(false);
  const signupMutation = api.auth.signup.useMutation();

  const isLoading = isSubmitting || providerLoading;

  async function onSubmit(values: LoginFormValues) {
    await wrapWithLoading(
      () =>
        signupMutation.mutateAsync({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      {
        loadingProps: {
          title: 'Création du compte...',
        },
        successProps: {
          title: 'Votre compte a été créé avec succès',
        },
        errorProps: error => {
          const title =
            error.message === 'ALREADY_EXISTS'
              ? 'Un compte existe déjà avec cette adresse email'
              : 'Une erreur est survenue lors de la création du compte';
          return {
            title,
          };
        },
        throwOnError: true,
      },
    )
      .then(() => {
        return signIn('credentials', {
          email: values.email,
          password: values.password,
          callbackUrl: '/',
        });
      })
      .catch(() => {
        // ignore
      });
  }

  async function providerSignin(provider: string) {
    try {
      setProviderLoading(true);
      await signIn(provider, { callbackUrl: '/' });
    } finally {
      setProviderLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    type="text"
                    autoComplete="name"
                    disabled={isLoading}
                    {...field}
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
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
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    type="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-2">
            <Button disabled={isLoading} className="mt-2">
              {isLoading && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
              S&apos;inscrire
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-primary px-2 text-secondary">OU</span>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => providerSignin('google')}
            className="flex-1"
          >
            {isLoading ? (
              <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <IconGoogle className="mr-2 h-4 w-4" />
            )}{' '}
            Google
          </Button>
        </div>
        <div className="text-center text-sm">
          <span className="text-secondary">Vous avez déjà un compte ?</span>{' '}
          <Link href="/auth/login" className="text-orange">
            Se connecter
          </Link>
        </div>
      </Form>
    </div>
  );
}
