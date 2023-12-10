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
      .nonempty({ message: 'Le mot de passe est requis' })
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    passwordConfirm: z
      .string()
      .nonempty({ message: 'La confirmation du mot de passe est requise' })
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirm'],
  });
type ActivateAccountFormValues = z.infer<typeof ActivateAccountForm>;

interface ActivateFormProps {
  email: string;
  token: string;
}

const ActivateForm = ({ email, token }: ActivateFormProps) => {
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
          // TODO title and description
          title: "Création de l'invitation en cours",
        },
        successProps: {
          // TODO title and description
          title: '🎉 Invitation créée avec succès',
        },
        errorProps: error => {
          // TODO title and description
          const title =
            error.message === 'ALREADY_EXISTS'
              ? 'Une invitation existe déjà avec cette adresse email'
              : "Une erreur est survenue lors de la création de l'invitation";
          return {
            title,
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
              <FormLabel>Mot de passe</FormLabel>
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
              <FormLabel>Confirmation du mot de passe</FormLabel>
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
          Créer mon compte
        </Button>
      </form>
    </Form>
  );
};

export default ActivateForm;
