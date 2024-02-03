import DayPicker from '@pedaki/design/ui/daypicker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pedaki/design/ui/form';
import {IconArrowRight, IconX} from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import { useScopedI18n, type TranslationGroup } from '~/locales/client.ts';
import dayjs from '~/locales/dayjs.ts';
import type { OutputType } from '~api/router/router.ts';
import React, {useEffect} from 'react';
import { useForm } from 'react-hook-form';
import {Button} from "@pedaki/design/ui/button";

type PossibleStudentData =
  OutputType['students']['imports']['students']['getPossibleStudentData']['current'];

interface FormProps<T extends PossibleStudentData = PossibleStudentData> {
  data: T;
  disabled?: boolean;
  children?: (form: ReturnType<typeof useForm<NonNullable<T>>>) => React.ReactNode;

  importedData?: PossibleStudentData | null;
  onSubmitted?: (data: NonNullable<T>) => void;
  onChange: (data: Partial<T>) => void;
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
    onChange,
}: FormProps) => {
  const form = useForm({
    mode: 'onChange',
    defaultValues: data ?? {},
  });

  const t = useScopedI18n(tKey);

    useEffect(() => {
        onChange && onChange(form.watch());
    }, [form.watch()]);

  const mergeAction = (field: keyof NonNullable<PossibleStudentData>) => {
    return () => {
      form.setValue(field, importedData![field]);
    };
  };

  const cleanAction = (field: keyof NonNullable<PossibleStudentData>, type: 'text' | 'date') => {
    return () => {
      // @ts-ignore
        form.setValue(field, type === 'text' ? '' : undefined);
    };
  }

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
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>{t(`${field}.label` as any)}</FormLabel>
                  <div className="relative flex items-center gap-1">
                    {importedData && importedData[f.name] && importedData[f.name] !== f.value && (
                      <MergeButton onClick={mergeAction(f.name)} />
                    )}
                    <FormControl>
                      {type === 'date' ? (
                        <DayPicker
                          {...f}
                          disabled={disabled}
                          // @ts-ignore
                          date={f.value || undefined}
                          // @ts-ignore
                          setDate={date => form.setValue(f.name, date)}
                          format={date => dayjs(date).format('L')}
                          className="w-full flex-1"
                        />
                      ) : (
                        // @ts-ignore
                        <Input
                            placeholder={t(`${field}.placeholder` as any)}
                            disabled={disabled} {...f} wrapperClassName="flex-1"/>
                      )}
                    </FormControl>
                      {!disabled && (
                            <CleanButton onClick={cleanAction(f.name, type)} disabled={!f.value} />
                      )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
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
      <TooltipContent>oui</TooltipContent>
    </Tooltip>
  );
};

const CleanButton = ({ onClick , disabled}: { onClick: () => void, disabled?: boolean }) => {
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
        <TooltipContent>oui</TooltipContent>
        </Tooltip>
    );
}

export default BaseForm;
