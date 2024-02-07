import { zodResolver } from '@hookform/resolvers/zod';
import { wrapWithLoading } from '@pedaki/common/utils/wrap-with-loading';
import { Button } from '@pedaki/design/ui/button';
import { Checkbox } from '@pedaki/design/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@pedaki/design/ui/form';
import { Input } from '@pedaki/design/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@pedaki/design/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pedaki/design/ui/select';
import { CreatePropertySchema } from '@pedaki/services/students/properties/properties.model';
import type { CreateProperty } from '@pedaki/services/students/properties/properties.model';
import { propertiesFields } from '~/components/students/import/student/constants.ts';
import { useScopedI18n } from '~/locales/client.ts';
import { api } from '~/server/clients/client.ts';
import React from 'react';
import { useForm } from 'react-hook-form';

const AddNewPropertyTrigger = () => {
  const t = useScopedI18n('students.schema.properties.new');
  const [isOpened, setIsOpened] = React.useState(false);

  const addPropertyMutation = api.students.properties.create.useMutation();

  const utils = api.useUtils();

  const onSubmit = async (data: CreateProperty) => {
    return wrapWithLoading(
      async () => {
        const newProperty = await addPropertyMutation.mutateAsync(data);
        utils.students.properties.getMany.setData(undefined, old => {
          return {
            ...old,
            [newProperty.id]: newProperty,
          };
        });
      },
      {
        // TODO trads
        errorProps: {},
        loadingProps: {},
        successProps: {},
        throwOnError: true,
      },
    )
      .catch(() => {
        // nothing
      })
      .finally(() => {
        setIsOpened(false);
      });
  };

  return (
    <Popover open={isOpened} onOpenChange={setIsOpened}>
      <PopoverTrigger asChild>
        <Button variant="stroke-primary-main" size="sm">
          {t('trigger')}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={24}
        align="start"
        side="top"
        className="w-[300px] md:w-[400px]"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <AddPropertyForm onSubmit={onSubmit} title={t('title')} />
      </PopoverContent>
    </Popover>
  );
};

const AddPropertyForm = ({
  onSubmit,
  title,
}: {
  onSubmit: (data: CreateProperty) => void;
  title: string;
  property?: CreateProperty;
}) => {
  const t = useScopedI18n('students.schema.properties');

  const form = useForm<CreateProperty>({
    resolver: zodResolver(CreatePropertySchema),
    defaultValues: {
      type: 'LEVEL',
      name: '',
      required: false,
    },
  });
  const { isValid } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <span className="text-label-md text-main">{title}</span>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12 md:col-span-5">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={value => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(`fields.${field.name}.placeholder`)}
                            className="w-full"
                          >
                            {t(`fields.${field.name}.options.${field.value}.label`)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(propertiesFields).map(type => (
                            <SelectItem key={type} value={type}>
                              {t(
                                `fields.${field.name}.options.${type as keyof typeof propertiesFields}.label`,
                              )}
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
          <div className="col-span-12 md:col-span-7">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t('fields.name.placeholder')}
                        type="text"
                        autoCapitalize="none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          {/*<div className="col-span-12 flex items-center md:col-span-3">*/}
          {/*  <FormField*/}
          {/*    control={form.control}*/}
          {/*    name="required"*/}
          {/*    render={({ field }) => {*/}
          {/*        return (*/}
          {/*        <FormItem className="flex items-center gap-2 space-y-0">*/}
          {/*          <FormControl>*/}
          {/*              /!*@ts-ignore*!/*/}
          {/*            <Checkbox*/}
          {/*                {...field}*/}
          {/*            />*/}
          {/*          </FormControl>*/}
          {/*          <FormLabel>{t('fields.required.label')}</FormLabel>*/}
          {/*        </FormItem>*/}
          {/*      );*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="filled-primary" size="sm" disabled={!isValid} type="submit">
            {t('action.add')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNewPropertyTrigger;
