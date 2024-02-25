'use client';

import { wrapWithLoading } from '@pedaki/common/utils/wrap-with-loading';
import { Button } from '@pedaki/design/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@pedaki/design/ui/form';
import { IconTrash } from '@pedaki/design/ui/icons';
import ConfirmDangerModal from '~/components/ConfirmDangerModal.tsx';
import { propertyFields } from '~/components/students/import/student/constants.ts';
import GenericField from '~/components/students/one/generic-field.tsx';
import { useScopedI18n } from '~/locales/client.ts';
import { api } from '~/server/clients/client.ts';
import { PROPERTIES } from '~/store/tutorial/data/schema-student/constants.ts';
import type { OutputType } from '~api/router/router.ts';
import React from 'react';
import { useForm } from 'react-hook-form';
import AddNewProperty from '../schema/add-property.tsx';

interface PropertiesSectionProps {
  initialProperties: OutputType['students']['properties']['getMany'];
}

const PropertiesSection = ({ initialProperties }: PropertiesSectionProps) => {
  const { data: properties } = api.students.properties.getMany.useQuery(undefined, {
    initialData: initialProperties,
    enabled: false,
  });

  return (
    <section className="space-y-4" id={PROPERTIES}>
      {/*TODO trads*/}
      <h2 className="text-label-sm font-medium text-main">Properties</h2>
      <PropertyFields properties={properties} />
      <AddNewProperty />
    </section>
  );
};

const PropertyFields = ({
  properties,
}: {
  properties: PropertiesSectionProps['initialProperties'];
}) => {
  const t = useScopedI18n('students.schema.fields');

  // TODO: pass form in parameters, and return only the fields
  const form = useForm<Record<string, any>>({});

  const deletePropertyMutation = api.students.properties.delete.useMutation();

  const utils = api.useUtils();

  const onSubmit = async (data: { id: number }) => {
    return wrapWithLoading(
      async () => {
        await deletePropertyMutation.mutateAsync(data);
        utils.students.properties.getMany.setData(undefined, old => {
          if (old) {
            delete old[data.id];
          }
          return old;
        });
      },
      {
        // TODO trads
        errorProps: e => ({
          title: e.message,
        }),
        loadingProps: {},
        successProps: {},
        throwOnError: false,
      },
    );
  };

  return (
    <Form {...form}>
      <form className="grid grid-cols-12 gap-4">
        {Object.entries(properties).map(([id, props]) => {
          return (
            <FormField
              key={id}
              control={form.control}
              name={id}
              render={({ field: f }) => {
                return (
                  <FormItem className="col-span-6">
                    <FormLabel className="flex items-center gap-2">
                      <span>{props.name}</span>
                      <ConfirmDangerModal
                        title="Remove Property"
                        confirmText="Remove"
                        cancelText="Cancel"
                        trigger={
                          <Button variant="ghost-error" className="h-6 w-6" size="icon">
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        }
                        onConfirm={() => onSubmit({ id: props.id })}
                        description="You are about to remove a property. This action cannot be undone."
                      >
                        <div>
                          <p></p>
                        </div>
                      </ConfirmDangerModal>
                    </FormLabel>
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
                  </FormItem>
                );
              }}
            />
          );
        })}
      </form>
    </Form>
  );
};

export default PropertiesSection;
