import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@pedaki/design/ui/badge';
import { Button } from '@pedaki/design/ui/button';
import { Form, FormControl, FormField, FormItem } from '@pedaki/design/ui/form';
import { IconPlus, IconTrash } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@pedaki/design/ui/popover';
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
import { Filter } from '@pedaki/services/students/query.model';
import type { FieldType } from '@pedaki/services/students/query.model';
import {
  FieldAllowedOperators,
  FilterSchema,
  getKnownField,
  isPositiveOperator,
} from '@pedaki/services/students/query.model.client.js';
import { useScopedI18n } from '~/locales/client.ts';
import { useStudentsListStore } from '~/store/students/list/list.store.ts';
import React, { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const Filters = ({
  filters,
  setFilters,
}: {
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}) => {
  const filtersCount = filters.length;
  return (
    <div className="flex h-9 w-full flex-row items-center gap-2 rounded-md border border-dashed p-1">
      <ul className="flex w-full items-center">
        {filters.map((filter, index) => {
          const key = `${filter.field}${filter.operator}${JSON.stringify(filter.value)}`;
          const isLast = index === filtersCount - 1;
          return (
            <Fragment key={key}>
              <li>
                <Filter filter={filter} setFilters={setFilters} />
              </li>
              {!isLast && (
                <span className="mx-1 mt-0.5 select-none text-label-xs text-sub">AND</span>
              )}
            </Fragment>
          );
        })}
        {filtersCount === 0 && (
          <span className="mx-1 mt-0.5 select-none text-label-xs text-sub">No filters</span>
        )}
      </ul>
      <TooltipProvider>
        <ClearFilters setFilters={setFilters} disabled={filtersCount === 0} />
        <NewFilter setFilters={setFilters} />
      </TooltipProvider>
    </div>
  );
};

const NewFilter = ({
  setFilters,
}: {
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}) => {
  const t = useScopedI18n('students.list.table.hide.columns');
  const [isOpened, setIsOpened] = React.useState(false);

  const addNewFilter = (filter: Filter) => {
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
        <TooltipContent>ll</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-[600px]">
        <EditFilter onSubmit={addNewFilter} title="Add new filter" />
      </PopoverContent>
    </Popover>
  );
};

const ClearFilters = ({
  setFilters,
  disabled,
}: {
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
  disabled: boolean;
}) => {
  const t = useScopedI18n('students.list.table.hide.columns');

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
      <TooltipContent>ll</TooltipContent>
    </Tooltip>
  );
};

const Filter = ({
  filter,
  setFilters,
}: {
  filter: Filter;
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}) => {
  const t = useScopedI18n('students.list.table');
  const [isOpened, setIsOpened] = React.useState(false);

  const columns = useStudentsListStore(store => store.translatedColumns);

  const removeFilter = (filter: Filter) => {
    setFilters(prev => prev.filter(f => f !== filter));
    setIsOpened(false);
  };

  const editFilter = (newFilter: Filter) => {
    setFilters(prev => prev.map(f => (f === filter ? newFilter : f)));
    setIsOpened(false);
  };

  const fieldTitle = filter && columns.find(column => column.id === filter.field)?.title;
  const isPositive = isPositiveOperator(filter.operator);

  return (
    <Popover open={isOpened} onOpenChange={setIsOpened}>
      <PopoverTrigger className="group focus:outline-none">
        <Badge className="group-focus:focus-ring-force cursor-pointer hover:bg-weak">
          <span>{fieldTitle}</span>&nbsp;
          <span className={cn(isPositive ? 'text-green-dark' : 'text-state-error')}>
            {filter.operator}
          </span>
          &nbsp;
          <span className="text-sub">{JSON.stringify(filter.value)}</span>
        </Badge>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[600px]">
        <EditFilter
          filter={filter}
          onSubmit={editFilter}
          onRemove={() => removeFilter(filter)}
          title="Edit filter"
        />
      </PopoverContent>
    </Popover>
  );
};

const EditFilter = ({
  filter,
  onSubmit,
  onRemove,
  title,
}: {
  filter?: Partial<Filter>;
  onSubmit: (filter: Filter) => void;
  onRemove?: () => void;
  title: string;
}) => {
  const t = useScopedI18n('students.list.table');

  const { columns, propertyTypes } = useStudentsListStore(store => ({
    columns: store.translatedColumns,
    propertyTypes: store.propertySchemaMapping,
  }));

  const form = useForm<Filter>({
    resolver: zodResolver(FilterSchema),
    mode: 'onChange',
    defaultValues: filter,
  });

  const { isValid } = form.formState;

  const { field, operator } = form.getValues();
  const isProperty = field && field.startsWith('properties.');
  const fieldTitle = field && columns.find(column => column.id === field)?.title;
  const fieldType =
    field && (getKnownField(field)?.fieldType ?? propertyTypes[field].type ?? 'text');

  const handleFormSubmit = (filter: Filter) => {
    filter.value = fieldType === 'int' ? parseInt(filter.value as string) : filter.value;

    if (isProperty) {
      const result = propertyTypes[field]?.schema.safeParse(filter.value);
      if (result && !result.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error(JSON.parse(result.error?.message)[0].message as string);
        return;
      }
    }

    onSubmit(filter);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <span className="text-label-md text-main">{title}</span>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="field"
              render={({ field }) => (
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
                        <SelectValue placeholder="Select field" className="w-full">
                          {fieldTitle ?? 'Select field'}
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
              )}
            />
          </div>
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      disabled={!field}
                      {...field}
                      onValueChange={value => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" className="w-full">
                          {operator ?? 'Select operator'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {fieldType &&
                          FieldAllowedOperators[fieldType].map(operator => (
                            <SelectItem key={operator} value={operator}>
                              {operator}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-4">
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
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          {onRemove && (
            <Button variant="ghost-error" size="sm" onClick={onRemove}>
              Remove
            </Button>
          )}
          <Button variant="filled-primary" size="sm" disabled={!isValid} type="submit">
            Apply
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
  const t = useScopedI18n('students.list.table');
  const disabled = fieldType === undefined || operator === undefined;

  if (fieldType === 'text' || fieldType === undefined) {
    return (
      <Input
        placeholder="kk"
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
        placeholder="kk"
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
