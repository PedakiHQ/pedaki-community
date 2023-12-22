'use client';

import type { PageType } from '~/app/types.ts';
import { api } from '~/server/clients/client.ts';
import { useWorkspaceStore } from '~/store/workspace/workspace.store.ts';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

// TODO: move this in a shared package
const SettingsFormSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "L'adresse email est requise" })
    .email("L'adresse email n'est pas valide"),
  password: z.string().nonempty({ message: 'Le mot de passe est requis' }),
});
type LoginFormValues = z.infer<typeof LoginFormSchema>;

export default async function Bidule({ params }: PageType) {
  const updateSetting = useWorkspaceStore(state => state.updateSetting);

  const changeSettingsMutation = api.workspace.setSetting.useMutation();

  const handleChange = (value: string) => {
    // todo c'est un test
    changeSettingsMutation
      .mutateAsync({
        key: 'NAME',
        value,
      })
      .then(() => {
        updateSetting('NAME', value);
      });
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  icon={IconMail}
                  placeholder="tony@parker.com"
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
          Se connecter
        </Button>

        <div className="flex items-center justify-between">
          <StyledLink
            href="/auth/forgot-password"
            className="text-p-xs"
            decoration="underline"
            variant="gray"
          >
            Mot de passe oublié ?
          </StyledLink>
          <StyledLink
            href="/auth/register"
            className="text-p-xs"
            decoration="underline"
            variant="gray"
          >
            Première connexion ?
          </StyledLink>
        </div>
      </form>
    </Form>
  );
}
