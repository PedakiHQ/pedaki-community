import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@pedaki/design/ui/button';
import DayPicker from '@pedaki/design/ui/daypicker';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@pedaki/design/ui/form';
import { IconArrowRight, IconX } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import type { TranslationGroup } from '~/locales/client.ts';
import { useScopedI18n } from '~/locales/client.ts';
import dayjs from '~/locales/dayjs.ts';
import type { OutputType } from '~api/router/router.ts';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

type PossibleStudentData =
  OutputType['students']['imports']['students']['getPossibleStudentData']['current'];

interface FormProps<T extends PossibleStudentData = PossibleStudentData> {
  schema?: z.Schema<T>;
  data: T;
  disabled?: boolean;
  children?: (form: ReturnType<typeof useForm<NonNullable<T>>>) => React.ReactNode;

  importedData?: PossibleStudentData | null;
  onSubmitted?: (data: NonNullable<T>) => void;
  fields: Partial<Record<keyof NonNullable<T>, 'text' | 'date'>>;
  tKey: TranslationGroup;
}

const BaseForm = ({
  data,
  disabled = false,
  children,
  importedData,
  onSubmitted,
  fields,
  tKey,
  schema,
}: FormProps) => {
  const form = useForm({
    resolver: schema && zodResolver(schema),
    mode: 'onChange',
    defaultValues: data ?? {},
  });

  const t = useScopedI18n(tKey);

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const mergeAction = (field: keyof NonNullable<PossibleStudentData>) => {
    return () => {
      form.setValue(field, importedData![field]);
      void form.trigger(field);
    };
  };

  const cleanAction = (field: keyof NonNullable<PossibleStudentData>, type: 'text' | 'date') => {
    return () => {
      form.setValue(field, type === 'text' ? '' : null);
      void form.trigger(field);
    };
  };

  return (
    <Form {...form}>
      <TooltipProvider>
        <form
          onSubmit={onSubmitted && form.handleSubmit(onSubmitted)}
          className="flex flex-col gap-4 py-2"
        >
          {Object.entries(fields).map(([field, type]) => (
            <FormField
              key={field}
              control={form.control}
              name={field as keyof NonNullable<PossibleStudentData>}
              render={({ field: f }) => {
                const isImported = !importedData;
                const isEquivalent = importedData
                  ? importedData?.[f.name]?.toString() === f.value?.toString()
                  : true;
                const isEmpty = f.value === '' || f.value === null;
                return (
                  <FormItem>
                    <FormLabel>{t(`${field}.label` as any)}</FormLabel>
                    <div className="relative flex w-full">
                      <div className="flex w-full items-center gap-1">
                        {!isEquivalent && <MergeButton onClick={mergeAction(f.name)} />}
                        <FormControl>
                          {type === 'date' ? (
                            <DayPicker
                              {...f}
                              disabled={disabled}
                              // @ts-expect-error:  todo not correctly typed
                              date={f.value ?? undefined}
                              setDate={date => form.setValue(f.name, date)}
                              format={date => dayjs(date).format('L')}
                              className="flex-1"
                              calendarProps={{
                                ISOWeek: true,
                                fromYear: 1900,
                                toYear: dayjs().year(),
                                captionLayout: 'dropdown-buttons',
                                defaultMonth: f.value ? dayjs(f.value).toDate() : undefined,
                              }}
                            />
                          ) : (
                            <Input
                              placeholder={!isImported ? t(`${field}.placeholder` as any) : ''}
                              disabled={disabled}
                              {...f}
                              // @ts-expect-error:  todo not correctly typed
                              value={f.value ?? ''}
                              wrapperClassName="flex-1"
                            />
                          )}
                        </FormControl>
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
