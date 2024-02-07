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
import dayjs from '~/locales/dayjs.ts';
import React from 'react';
import type { ControllerRenderProps, FieldValues, useForm } from 'react-hook-form';
import type { BaseFields } from '../import/student/constants';

interface GenericFieldProps<F extends FieldValues = FieldValues> {
  field: ControllerRenderProps<F, any>;
  form: ReturnType<typeof useForm<F>>;
  type: BaseFields;
  disabled: boolean;
  placeholder?: string | boolean;
  t: (key: string) => string;
}

const GenericField = <F extends FieldValues>({
  field,
  form,
  type,
  disabled,
  placeholder,
  t,
}: GenericFieldProps<F>) => {
  const placeholderText = !placeholder
    ? t(`${field.name}.placeholder`)
    : type.placeholder ?? undefined;

  return (
    <FormControl>
      {type.type === 'date' ? (
        <DayPicker
          {...field}
          disabled={disabled}
          date={field.value ?? undefined}
          // @ts-expect-error:  todo not correctly typed
          setDate={date => form.setValue(field.name, date)}
          format={date => dayjs(date).format('L')}
          className="flex-1"
          calendarProps={{
            ISOWeek: true,
            fromYear: 1900,
            toYear: dayjs().year(),
            captionLayout: 'dropdown-buttons',
            defaultMonth: field.value ? dayjs(field.value).toDate() : undefined,
          }}
        />
      ) : type.type === 'select' ? (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={placeholderText} disabled={disabled} {...field} />
          </SelectTrigger>
          <SelectContent>
            {type.options?.map(option => (
              <SelectItem key={option} value={option}>
                {t(`${field.name}.options.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : type.type === 'number' ? (
        <Input
          placeholder={placeholderText}
          disabled={disabled}
          type="number"
          {...field}
          value={field.value ?? ''}
          wrapperClassName="flex-1"
          min={type.min}
          max={type.max}
        />
      ) : (
        <Input
          placeholder={placeholderText}
          disabled={disabled}
          {...field}
          value={field.value ?? ''}
          wrapperClassName="flex-1"
        />
      )}
    </FormControl>
  );
};

export default GenericField;
