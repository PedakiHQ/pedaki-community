'use client';

import { Button } from '@pedaki/design/ui/button';
import { Form } from '@pedaki/design/ui/form';
import { IconSpinner } from '@pedaki/design/ui/icons';
import { Separator } from '@pedaki/design/ui/separator';
import type { Student } from '@pedaki/services/students/student_base.model';
import { useScopedI18n } from '~/locales/client';
import type { OutputType } from '~api/router/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import PersonalInfoForm from './personal-info-form';
import PropertiesSection from './properties-section';

interface FormValues {
  // avatar: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  birthDate: Date | null;
  gender?: string;
}

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
    defaultValues: {
      // avatar: '',
      firstName: student?.firstName ?? '',
      lastName: student?.lastName ?? '',
      otherName: student?.otherName ?? '',
      birthDate: student?.birthDate ?? null,
      gender: student?.gender ?? '',
    },
  });

  function onSubmit(values: FormValues) {
    // No submit on edit schema
    if (editSchema) return;
    console.log(values);
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
              <div>TODO: properties</div>
            </>
          )}
          <div className="flex justify-end">
            <Button variant="filled-primary" type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
              {t(student ? 'edit.submit' : 'create.submit')}
            </Button>
          </div>
        </form>
      </Form>
      {!student && editSchema && (
        <>
          <Separator />
          <PropertiesSection initialProperties={properties} />
        </>
      )}
    </>
  );
};
export default EditStudentForm;
