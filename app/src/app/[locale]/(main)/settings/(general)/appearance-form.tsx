'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@pedaki/design/ui/button';
import { Form } from '@pedaki/design/ui/form';
import { IconSpinner } from '@pedaki/design/ui/icons';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const SettingsFormSchema = z.object({
  // image: z.string().max(25), // TODO
  // theme: z.string().email(),
});
type SettingsFormValues = z.infer<typeof SettingsFormSchema>;

// TODO: image upload, color picker, default language

const AppearanceForm = () => {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsFormSchema),
    mode: 'onChange',
    defaultValues: {},
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

  function onSubmit(values: SettingsFormValues) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

export default AppearanceForm;
