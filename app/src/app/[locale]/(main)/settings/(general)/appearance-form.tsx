'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import wait from '@pedaki/common/utils/wait';
import { wrapWithLoading } from '@pedaki/common/utils/wrap-with-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@pedaki/design/ui/avatar';
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
import { Skeleton } from '@pedaki/design/ui/skeleton';
import { useHasChanged } from '~/app/[locale]/(main)/settings/useHasChanged.ts';
import { LOGO_MAX_SIZE, LOGO_TYPES } from '~/app/api/upload/logo/constants.ts';
import { updateLogo } from '~/app/api/upload/logo/fetch.ts';
import { useWorkspaceStore } from '~/store/workspace/workspace.store.ts';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const FormSchema = z.object({
  logo: z
    .custom<File>()
    .refine(file => file instanceof File, {
      message: 'Le fichier doit être une image.',
    })
    .refine(file => LOGO_TYPES.includes(file.type), {
      message: 'Le fichier doit être au format PNG ou JPG.',
    })
    .refine(file => file.size < LOGO_MAX_SIZE, {
      message: 'Le fichier doit être inférieur à 2 Mo.',
    })
    .optional(),
});
type FormValues = z.infer<typeof FormSchema>;

// TODO: color picker

const AppearanceForm = () => {
  const logoUrl = useWorkspaceStore(state => state.logoUrl);
  const updateLogoUrl = useWorkspaceStore(state => state.updateLogoUrl);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {},
  });

  const { isSubmitting } = form.formState;

  const setHasChanged = useHasChanged();

  function onSubmit(values: FormValues) {
    if (!values.logo) return;

    return wrapWithLoading(() => wait(updateLogo(values.logo!), 500), {
      loadingProps: {
        // TODO title and description
        title: "Création de l'invitation en cours",
      },
      successProps: {
        // TODO title and description
        title: '🎉 Logo mis à jour avec succès',
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
    })
      .then(() => {
        setHasChanged(false);
      })
      .catch(() => {
        // nothing
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="logo"
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Logo du workspace</FormLabel>
              <div className="flex w-full flex-row items-end gap-2">
                <div>
                  <Avatar className="flex size-24 items-center justify-center rounded-sm border object-cover">
                    <AvatarImage src={logoUrl} alt={'alt'} className="size-24" />
                    <AvatarFallback>
                      <Skeleton className="size-24 bg-neutral-300">&nbsp;</Skeleton>
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="-mt-2 w-full flex-1 shrink-0">
                  <FormControl>
                    <Input
                      placeholder="shrek"
                      type="file"
                      autoCapitalize="none"
                      autoCorrect="off"
                      accept={LOGO_TYPES.join(', ')}
                      multiple={false}
                      disabled={isSubmitting}
                      {...rest}
                      value={undefined}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        onChange(file);
                        updateLogoUrl(URL.createObjectURL(file));
                        setHasChanged(true);
                      }}
                    />
                  </FormControl>
                  <FormMessage>
                    <FormDescription>
                      blabla la preview peut changer (taille recommendée 200x200)
                    </FormDescription>
                  </FormMessage>
                </div>
              </div>
            </FormItem>
          )}
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

export default AppearanceForm;
