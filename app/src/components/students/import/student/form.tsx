import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@pedaki/design/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@pedaki/design/ui/form';
import { IconArrowRight, IconX } from '@pedaki/design/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import type { BaseFields } from '~/components/students/import/student/constants.ts';
import { propertyFields } from '~/components/students/import/student/constants.ts';
import GenericField from '~/components/students/one/generic-field.tsx';
import { useScopedI18n } from '~/locales/client.ts';
import type { OutputType } from '~api/router/router.ts';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

type PossibleStudentData =
  | OutputType['students']['imports']['students']['getPossibleStudentData']
  | null;

interface FormProps<T extends PossibleStudentData = PossibleStudentData> {
  schema?: z.Schema<T>;
  data: T;
  disabled?: boolean;
  children?: (form: ReturnType<typeof useForm<NonNullable<T>>>) => React.ReactNode;

  importedData?: PossibleStudentData | null;
  onSubmitted?: (data: NonNullable<T>) => void;
  fields: Record<string, BaseFields>;
  properties: OutputType['students']['properties']['getMany'];
}

const BaseForm = ({
  data,
  disabled = false,
  children,
  importedData,
  onSubmitted,
  fields,
  properties,
  schema,
}: FormProps) => {
  const form = useForm({
    resolver: schema && zodResolver(schema),
    mode: 'onChange',
    defaultValues: data ?? {},
  });

  const tField = useScopedI18n('students.schema.fields');

  useEffect(() => {
    if (data) {
      form.reset(data);
      void form.trigger();
    }
  }, [data, form]);

  const mergeAction = (field: string) => {
    return () => {
      // TODO: fix this
      /* @ts-expect-error: type is incorrect*/
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      form.setValue(field, importedData![field]);
      /* @ts-expect-error: type is incorrect*/
      void form.trigger(field);
    };
  };

  const cleanAction = (field: string, type: BaseFields) => {
    return () => {
      /* @ts-expect-error: type is incorrect*/
      form.setValue(field, type.type === 'text' ? '' : null);
      /* @ts-expect-error: type is incorrect*/
      void form.trigger(field);
    };
  };

  const submit = (values: NonNullable<PossibleStudentData>) => {
    // remove _ in properties
    const properties = !values.properties
      ? {}
      : Object.fromEntries(
          Object.entries(values.properties).map(([key, value]) => {
            return [key.replace('_', ''), Number(value)]; // TODO handle other types
          }),
        );
    const data = {
      ...values,
      properties,
    };
    onSubmitted?.(data);
  };

  return (
    <Form {...form}>
      <TooltipProvider>
        <form
          onSubmit={onSubmitted && form.handleSubmit(submit)}
          className="flex flex-col gap-4 py-2"
        >
          {Object.entries(fields).map(([field, type]) => (
            <FormField
              key={field}
              control={form.control}
              // @ts-expect-error: type is incorrect
              name={field}
              render={({ field: f }) => {
                const isImported = !importedData;
                const isEquivalent = importedData
                  ? // TODO: fix this
                    // @ts-expect-error: type is incorrect
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                    importedData?.[f.name]?.toString() === f.value?.toString()
                  : true;
                const isEmpty = f.value === '' || f.value === null;
                return (
                  <FormItem>
                    {/* @ts-expect-error: type is incorrect*/}
                    <FormLabel>{tField(`${f.name}.label`)}</FormLabel>
                    <div className="relative flex w-full">
                      <div className="flex w-full items-center gap-1">
                        {!isEquivalent && <MergeButton onClick={mergeAction(f.name)} />}
                        <GenericField
                          field={f}
                          type={type}
                          disabled={isImported}
                          // @ts-expect-error: type is incorrect
                          t={tField}
                          placeholder={!isImported}
                        />
                        {!disabled && (
                          <CleanButton onClick={cleanAction(f.name, type)} disabled={isEmpty} />
                        )}
                      </div>
                    </div>
                  </FormItem>
                );
              }}
            />
          ))}
          {Object.entries(properties).map(([id, props]) => {
            const key = `properties._${id}` as const;
            const type = propertyFields[props.type];
            return (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field: f }) => {
                  const isImported = !importedData;
                  const isEmpty = f.value === '' || f.value === null || f.value === undefined;
                  return (
                    <FormItem>
                      <FormLabel>{props.name}</FormLabel>
                      <div className="relative flex w-full">
                        <div className="flex w-full items-center gap-1">
                          <GenericField
                            field={f}
                            type={type}
                            disabled={isImported}
                            // @ts-expect-error: type is incorrect
                            t={tField}
                            placeholder={true}
                          />
                          {!disabled && (
                            <CleanButton onClick={cleanAction(f.name, type)} disabled={isEmpty} />
                          )}
                        </div>
                      </div>
                    </FormItem>
                  );
                }}
              />
            );
          })}
          {children && children(form)}
        </form>
      </TooltipProvider>
    </Form>
  );
};

const MergeButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="absolute -left-7 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-sm border bg-white text-primary-base"
          onClick={onClick}
        >
          <IconArrowRight className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {/*TODO translate*/}
        oui
      </TooltipContent>
    </Tooltip>
  );
};

const CleanButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => {
  return (
    <Tooltip open={disabled ? false : undefined}>
      <TooltipTrigger asChild>
        <Button
          disabled={disabled}
          size="icon"
          variant="ghost-error"
          onClick={onClick}
          type="button"
        >
          <IconX className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {/*TODO translate*/}
        oui
      </TooltipContent>
    </Tooltip>
  );
};

export default BaseForm;
