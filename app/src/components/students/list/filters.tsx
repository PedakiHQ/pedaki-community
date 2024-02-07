import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@pedaki/design/ui/badge';
import { Button } from '@pedaki/design/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@pedaki/design/ui/form';
import { IconPlus, IconTrash } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@pedaki/design/ui/popover';
import { ScrollArea } from '@pedaki/design/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pedaki/design/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import { cn } from '@pedaki/design/utils';
import { FilterSchema, getKnownField } from '@pedaki/services/students/query.model.client.js';
import { FieldAllowedOperators, isPositiveOperator } from '@pedaki/services/utils/query';
import type { DefaultFilter, FieldType } from '@pedaki/services/utils/query';
import { useScopedI18n } from '~/locales/client.ts';
import { useStudentsListStore } from '~/store/students/list/list.store';
import React, { Fragment } from 'react';
import { useForm } from 'react-hook-form';

const typedValue = (value: unknown, type: FieldType): string | number => {
  if (type === 'int') {
    return parseInt(value as string);
  }
  return value as string;
};

const Filters = <T extends DefaultFilter>({
  filters,
  setFilters,
}: {
  filters: T[];
  setFilters: React.Dispatch<React.SetStateAction<T[]>>;
}) => {
  const t = useScopedI18n('components.datatable.filters');
  const filtersCount = filters.length;
  return (
    <div className="flex h-9 w-full flex-row items-center gap-2 rounded-md border border-dashed p-1">
      <ScrollArea orientation="horizontal">
        <ul className="flex w-full items-center gap-0.5">
          {filters.map((filter, index) => {
            const key = `${filter.field}${filter.operator}${JSON.stringify(filter.value)}`;
            const isLast = index === filtersCount - 1;
            return (
              <Fragment key={key}>
                <li className="shrink-0">
                  <Filter filter={filter} setFilters={setFilters} />
                </li>
                {!isLast && (
                  <span className="mt-0.5 shrink-0 select-none text-label-xs text-sub">
                    {t('and')}
                  </span>
                )}
              </Fragment>
            );
          })}
          {filtersCount === 0 && (
            <span className="select-none text-label-xs text-sub">{t('noFilters')}</span>
          )}
        </ul>
      </ScrollArea>
      <div className="flex-1"></div>
      <TooltipProvider>
        <ClearFilters setFilters={setFilters} disabled={filtersCount === 0} />
        <NewFilter setFilters={setFilters} />
      </TooltipProvider>
    </div>
  );
};

const NewFilter = <T extends DefaultFilter>({
  setFilters,
}: {
  setFilters: React.Dispatch<React.SetStateAction<T[]>>;
}) => {
  const t = useScopedI18n('components.datatable.filters.new');
  const [isOpened, setIsOpened] = React.useState(false);

  const addNewFilter = (filter: T) => {
    setFilters(prev => [...prev, filter]);
    setIsOpened(false);
  };

  return (
    <Popover open={isOpened} onOpenChange={setIsOpened}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="lighter-primary" size="icon" className="h-6 w-6 shrink-0">
              <IconPlus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('label')}</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-[300px] md:w-[600px]">
        <EditFilter onSubmit={addNewFilter} title={t('title')} />
      </PopoverContent>
    </Popover>
  );
};

const ClearFilters = <T extends DefaultFilter>({
  setFilters,
  disabled,
}: {
  setFilters: React.Dispatch<React.SetStateAction<T[]>>;
  disabled: boolean;
}) => {
  const t = useScopedI18n('components.datatable.filters.clear');

  const clearFilters = () => {
    setFilters([]);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="filled-neutral"
          size="icon"
          className="h-6 w-6 shrink-0"
          disabled={disabled}
          onClick={clearFilters}
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t('label')}</TooltipContent>
    </Tooltip>
  );
};

const Filter = <T extends DefaultFilter>({
  filter,
  setFilters,
}: {
  filter: T;
  setFilters: React.Dispatch<React.SetStateAction<T[]>>;
}) => {
  const t = useScopedI18n('components.datatable.filters');
  const [isOpened, setIsOpened] = React.useState(false);

  const columns = useStudentsListStore(store => store.translatedColumns);

  const removeFilter = (filter: T) => {
    setFilters(prev => prev.filter(f => f !== filter));
    setIsOpened(false);
  };

  const editFilter = (newFilter: T) => {
    setFilters(prev => prev.map(f => (f === filter ? newFilter : f)));
    setIsOpened(false);
  };

  const fieldTitle = (filter && columns.find(column => column.id === filter.field)?.title) ?? '-';
  const isPositive = isPositiveOperator(filter.operator);

  return (
    <Popover open={isOpened} onOpenChange={setIsOpened}>
      <PopoverTrigger className="group p-1.5 focus:outline-none">
        <Badge className="group-focus:focus-ring-force cursor-pointer hover:bg-weak">
          <span className="whitespace-nowrap">{fieldTitle}</span>&nbsp;
          <span className={cn(isPositive ? 'text-green-dark' : 'text-state-error')}>
            {t(`form.operator.shortNames.${filter.operator}`)}
          </span>
          &nbsp;
          <span className="text-sub">{JSON.stringify(filter.value)}</span>
        </Badge>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[300px] md:w-[600px]">
        <EditFilter
          filter={filter}
          onSubmit={editFilter}
          onRemove={() => removeFilter(filter)}
          title={t('edit.title')}
        />
      </PopoverContent>
    </Popover>
  );
};

const EditFilter = <T extends DefaultFilter>({
  filter,
  onSubmit,
  onRemove,
  title,
}: {
  filter?: Partial<DefaultFilter>;
  onSubmit: (filter: T) => void;
  onRemove?: () => void;
  title: string;
}) => {
  const t = useScopedI18n('components.datatable.filters.form');

  const { columns, propertyTypes } = useStudentsListStore(store => ({
    columns: store.translatedColumns,
    propertyTypes: store.propertySchemaMapping as Record<
      string,
      (typeof store.propertySchemaMapping)[keyof typeof store.propertySchemaMapping]
    >,
  }));

  const form = useForm<DefaultFilter>({
    resolver: zodResolver(
      FilterSchema.refine(({ field, value }) => {
        const isProperty = field?.startsWith('properties.');
        if (isProperty && value) {
          propertyTypes[field]?.schema.parse(typedValue(value, fieldType), {
            path: ['value'],
          });
        }
        return true;
      }),
    ),
    mode: 'onChange',
    defaultValues: filter,
  });

  const { isValid } = form.formState;

  const { field, operator } = form.getValues();
  const fieldType = ((field
    ? getKnownField(field)?.fieldType ?? propertyTypes[field]?.type
    : undefined) ?? 'text') as FieldType;

  const handleFormSubmit = (filter: DefaultFilter) => {
    filter.value = typedValue(filter.value, fieldType);
    onSubmit(filter as T);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <span className="text-label-md text-main">{title}</span>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="field"
              render={({ field }) => {
                const fieldTitle =
                  field.value && columns.find(column => column.id === field.value)?.title;
                return (
                  <FormItem>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={value => {
                          field.onChange(value);
                          form.resetField('operator');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('field.placeholder')} className="w-full">
                            {fieldTitle ?? t('field.placeholder')}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {columns
                            .filter(column => column.id && column.title)
                            .map(column => (
                              <SelectItem key={column.id} value={column.id}>
                                {column.title}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      {...field}
                      disabled={!fieldType}
                      onValueChange={value => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('operator.placeholder')} className="w-full">
                          {field.value
                            ? t(`operator.names.${field.value}`)
                            : t('operator.placeholder')}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {fieldType &&
                          FieldAllowedOperators[fieldType].map(operator => (
                            <SelectItem key={operator} value={operator}>
                              {t(`operator.names.${operator}`)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FilterValue
                      fieldType={fieldType}
                      operator={operator}
                      initialValue={field.value}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          {onRemove && (
            <Button variant="ghost-error" size="sm" onClick={onRemove}>
              {t('action.remove')}
            </Button>
          )}
          <Button variant="filled-primary" size="sm" disabled={!isValid} type="submit">
            {onRemove ? t('action.update') : t('action.add')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const FilterValue = ({
  onChange,
  fieldType,
  operator,
  initialValue,
}: {
  onChange: (value: any) => void;
  fieldType: FieldType | null;
  operator: string | undefined;
  initialValue?: any;
}) => {
  const t = useScopedI18n('components.datatable.filters.form.value');
  const disabled = fieldType === undefined || operator === undefined;

  if (fieldType === 'text' || fieldType === undefined) {
    return (
      <Input
        placeholder={t('placeholder.text')}
        type="text"
        autoCapitalize="none"
        autoCorrect="off"
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        defaultValue={initialValue as string}
      />
    );
  }

  if (fieldType === 'int') {
    return (
      <Input
        placeholder={t('placeholder.int')}
        type="number"
        autoCapitalize="none"
        autoCorrect="off"
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        defaultValue={initialValue as string}
      />
    );
  }

  return <div></div>;
};

export default Filters;
