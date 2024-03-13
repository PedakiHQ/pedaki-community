'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import wait from '@pedaki/common/utils/wait';
import { wrapWithLoading } from '@pedaki/common/utils/wrap-with-loading';
import { Button } from '@pedaki/design/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@pedaki/design/ui/form';
import { IconSpinner } from '@pedaki/design/ui/icons';
import { Separator } from '@pedaki/design/ui/separator';
import { StudentSchema } from '@pedaki/services/students/student_base.model';
import type { Student } from '@pedaki/services/students/student_base.model';
import { propertyFields } from '~/components/students/import/student/constants.ts';
import { useScopedI18n } from '~/locales/client';
import { api } from '~/server/clients/client';
import type { OutputType } from '~api/router/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import ConfigPropertiesSection from './config-properties-section';
import GenericField from './generic-field';
import PersonalInfoForm from './personal-info-form';

const EditStudentFormSchema = StudentSchema.pick({
  firstName: true,
  lastName: true,
  otherName: true,
  birthDate: true,
  gender: true,
  properties: true,
});
type FormValues = z.infer<typeof EditStudentFormSchema>;

export type Form = ReturnType<typeof useForm<FormValues>>;

const EditStudentForm = ({
  student,
  properties,
  editSchema,
}: {
  student?: Student;
  properties: OutputType['students']['properties']['getMany'];
  editSchema?: boolean;
}) => {
  const t = useScopedI18n('students.schema');

  const form = useForm<FormValues>({
    resolver: !editSchema ? zodResolver(EditStudentFormSchema) : undefined,
    mode: !editSchema ? 'onChange' : undefined,
    defaultValues: {
      // avatar: '',
      firstName: student?.firstName ?? '',
      lastName: student?.lastName ?? '',
      otherName: student?.otherName ?? '',
      birthDate: student?.birthDate ?? undefined,
      gender: student?.gender ?? '',
      properties: student?.properties ?? {},
    },
  });

  const updateMutation = api.students.updateOne.useMutation();
  const createMutation = api.students.createOne.useMutation();

  function onSubmit(values: FormValues) {
    // No submit on edit schema
    if (editSchema) return;

    const type = student?.id !== undefined ? 'edit' : 'create';
    return wrapWithLoading(
      async () => {
        if (type === 'edit') {
          return wait(updateMutation.mutateAsync({ ...values, id: student!.id }), 200);
        } else {
          return wait(createMutation.mutateAsync(values), 200);
        }
      },
      {
        loadingProps: {
          title: t(`${type}.submit.loading.title`),
          description: t(`${type}.submit.loading.description`),
        },
        successProps: {
          title: t(`${type}.submit.success.title`),
          description: t(`${type}.submit.success.description`),
        },
        errorProps: _error => {
          return {
            title: t(`${type}.submit.error.title`),
            description: t(`${type}.submit.error.description`),
          };
        },
        throwOnError: true,
      },
    );
  }

  const { isSubmitting } = form.formState;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <PersonalInfoForm form={form} />
          {!editSchema && (
            <>
              <Separator />
              <EditStudentPropertiesForm form={form} properties={properties} />
            </>
          )}
          <div className="flex justify-end">
            <Button variant="filled-primary" type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
              {t(student ? 'edit.submit.label' : 'create.submit.label')}
            </Button>
          </div>
        </form>
      </Form>
      {!student && editSchema && (
        <>
          <Separator />
          <ConfigPropertiesSection initialProperties={properties} />
        </>
      )}
    </>
  );
};

const EditStudentPropertiesForm = ({
  form,
  properties,
}: {
  form: Form;
  properties: OutputType['students']['properties']['getMany'];
}) => {
  const t = useScopedI18n('students.schema.properties');

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        {Object.entries(properties).map(([id, props]) => {
          return (
            <FormField
              key={id}
              control={form.control}
              name={`properties.${id}`}
              render={({ field: f }) => {
                return (
                  <FormItem className="col-span-6">
                    <FormLabel className="flex items-center gap-2">{props.name}</FormLabel>
                    <div className="relative flex w-full">
                      <div className="flex w-full items-center gap-1">
                        <GenericField
                          field={f}
                          type={propertyFields[props.type]}
                          disabled={false}
                          placeholder={props.name}
                          // @ts-expect-error: type is incorrect
                          t={t}
                        />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default EditStudentForm;
