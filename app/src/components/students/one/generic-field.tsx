import DayPicker from '@pedaki/design/ui/daypicker';
import { FormControl } from '@pedaki/design/ui/form';
import { Input } from '@pedaki/design/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pedaki/design/ui/select';
import { cn } from '@pedaki/design/utils';
import dayjs from '~/locales/dayjs.ts';
import React from 'react';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';
import type { BaseFields } from '../import/student/constants';

interface GenericFieldProps<F extends FieldValues = FieldValues> {
  field: Partial<ControllerRenderProps<F, any>> & Pick<ControllerRenderProps<F, any>, 'onChange'>;
  type: BaseFields | undefined;
  disabled: boolean;
  placeholder?: string | boolean;
  t: (key: string) => string;
  className?: string;
  withForm?: boolean;
}

const GenericField = <F extends FieldValues>({
  field,
  type,
  disabled,
  placeholder,
  t,
  className,
  withForm = true,
}: GenericFieldProps<F>) => {
  const placeholderText = !placeholder
    ? t(`${field.name}.placeholder`)
    : type?.placeholder ?? undefined;

  const Wrapper = withForm ? FormControl : React.Fragment;

  return (
    <Wrapper>
      {type?.type === 'date' ? (
        <DayPicker
          {...field}
          disabled={disabled}
          date={field.value ?? undefined}
          setDate={date => field.onChange(date)}
          format={date => dayjs(date).format('L')}
          className={cn('flex-1', className)}
          calendarProps={{
            ISOWeek: true,
            fromYear: 1900,
            toYear: dayjs().year(),
            captionLayout: 'dropdown-buttons',
            defaultMonth: field.value ? dayjs(field.value).toDate() : undefined,
          }}
        />
      ) : type?.type === 'select' ? (
        <Select {...field} onValueChange={value => field.onChange(value)}>
          <SelectTrigger className={cn('flex-1', className)}>
            <SelectValue placeholder={placeholderText} />
          </SelectTrigger>
          <SelectContent>
            {type.options?.map(option => (
              <SelectItem key={option} value={option}>
                {t(`${field.name}.options.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : type?.type === 'number' ? (
        <Input
          placeholder={placeholderText}
          disabled={disabled}
          type="number"
          {...field}
          value={field.value ?? ''}
          wrapperClassName={cn('flex-1', className)}
          min={type.min}
          max={type.max}
        />
      ) : (
        <Input
          placeholder={placeholderText}
          disabled={disabled}
          {...field}
          value={field.value ?? ''}
          wrapperClassName={cn('flex-1', className)}
        />
      )}
    </Wrapper>
  );
};

export default GenericField;
