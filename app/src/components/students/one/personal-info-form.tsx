'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@pedaki/design/ui/avatar';
import { Form, FormField, FormItem, FormLabel } from '@pedaki/design/ui/form';
import GenericField from '~/components/students/one/generic-field.tsx';
import { useScopedI18n } from '~/locales/client';
import { BASE_INFO } from '~/store/tutorial/data/schema-student/constants.ts';
import React from 'react';
import { useForm } from 'react-hook-form';
import { fields } from '../import/student/constants';

interface FormValues {
  avatar: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  birthDate: Date | null;
  gender?: string;
}

type Form = ReturnType<typeof useForm<FormValues>>;

const PersonalInfoForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      avatar: '',
      firstName: '',
      lastName: '',
      otherName: '',
      birthDate: null,
      gender: '',
    },
  });

  return (
    <section className="space-y-4" id={BASE_INFO}>
      {/*TODO trads*/}
      <h2 className="text-label-sm font-medium text-main">Base info</h2>
      <Form {...form}>
        <form className="grid grid-cols-12 gap-6">
          <div className="@4xl:order-0 order-1 col-span-12 @4xl:col-span-9">
            <div className="flex flex-col gap-4">
              <BaseData form={form} />
            </div>
          </div>
          <div className="order-0 col-span-12 flex flex-col justify-start space-y-1 @4xl:order-1 @4xl:col-span-3">
            <label className="flex items-center space-x-1 text-label-sm font-medium text-main">
              Image
            </label>
            <UserImage form={form} />
          </div>
        </form>
      </Form>
    </section>
  );
};

const UserImage = ({ form }: { form: Form }) => {
  return (
    <div className="rounded-none">
      <Avatar className="aspect-square h-full max-h-[400px] min-h-[150px] w-auto rounded-md border bg-weak">
        <AvatarImage src={form.watch('avatar')} alt="avatar" className="rounded-none" />
        <AvatarFallback className="select-none rounded-none text-label-sm text-sub">
          No image
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

const BaseData = ({ form }: { form: Form }) => {
  const t = useScopedI18n('students.schema.fields');

  return (
    <>
      {Object.entries(fields).map(([field, type]) => {
        return (
          <FormField
            key={field}
            control={form.control}
            name={field as keyof typeof fields}
            render={({ field: f }) => {
              return (
                <FormItem>
                  <FormLabel>{t(`${f.name}.label` as any)}</FormLabel>
                  <div className="relative flex w-full">
                    <div className="flex w-full items-center gap-1">
                      <GenericField
                        field={f}
                        type={type}
                        disabled={false}
                        // @ts-expect-error: type is incorrect
                        t={t}
                      />
                    </div>
                  </div>
                </FormItem>
              );
            }}
          />
        );
      })}
    </>
  );
};

export default PersonalInfoForm;
