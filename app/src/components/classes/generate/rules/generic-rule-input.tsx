import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@pedaki/design/ui/button';
import { DialogFooter } from '@pedaki/design/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem } from '@pedaki/design/ui/form';
import { IconArrowDownRight, IconPlus } from '@pedaki/design/ui/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pedaki/design/ui/select';
import { TooltipProvider } from '@pedaki/design/ui/tooltip';
import type { RawAttribute } from '@pedaki/services/algorithms/generate_classes/input.schema';
import { RawAttributeSchema } from '@pedaki/services/algorithms/generate_classes/input.schema';
import type { Field } from '@pedaki/services/students/query.model.client';
import AttributeIcon from '~/components/classes/generate/rules/attribute-icon.tsx';
import type { RuleMappingValue } from '~/components/classes/generate/rules/constants.ts';
import { MAX_ATTRIBUTES } from '~/components/classes/generate/rules/constants.ts';
import { fields, propertyFields } from '~/components/students/import/student/constants';
import GenericField from '~/components/students/one/generic-field.tsx';
import { useScopedI18n } from '~/locales/client.ts';
import { useStudentsListStore } from '~/store/students/list/list.store.ts';
import React, { useEffect } from 'react';
import type { Control, ControllerRenderProps } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { DeleteAttributeButton } from './delete-attribute-button';

type Rule = {
  ruleMapping: RuleMappingValue;
  defaultValues?: RawAttribute[];
  onCanceled?: () => void;
  onDeleted?: () => void;
  onSaved?: (rule: RawAttribute[]) => Promise<void>;
} & (
      | { onCanceled: () => void; onSaved: (rule: RawAttribute[]) => Promise<void> }
      | { onDeleted: () => void }
    );

interface FormValues {
  attributes: RawAttribute[];
} // TODO weird type

const attributesFields: readonly (keyof RawAttribute)[] = ['genders', 'options'];
const partialOperators = ['eq', 'gte', 'lte'] as const;
type PartialOperator = (typeof partialOperators)[number];

const GenericRuleInputForm = (props: Rule) => {
  const { onCanceled, onDeleted, onSaved, ruleMapping } = props;

  const form = useForm<FormValues>({
    resolver: zodResolver(z.object({ attributes: RawAttributeSchema.array() })),
    mode: 'onChange',
    defaultValues: {
      attributes: props.defaultValues
        ? props.defaultValues
        : ruleMapping.attributesCount === 'one' || ruleMapping.attributesCount === 'one_or_more'
          ? [{}]
          : ruleMapping.attributesCount === 'two_or_more'
            ? [{}, {}]
            : [],
    },
  });

  const { isValid } = form.formState;

  const onSubmit = async (data: FormValues) => {
    if (onSaved) {
      await onSaved(data.attributes);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col">
          <GenericRuleInput form={form} ruleMapping={ruleMapping} />

          <DialogFooter>
            {onCanceled && (
              <Button variant="stroke-primary-main" onClick={onCanceled} type="button">
                {/*TODO: trads*/}
                Retour
              </Button>
            )}
            {onDeleted && (
              <Button variant="filled-error" onClick={onDeleted} type="button">
                {/*TODO: trads*/}
                Supprimer
              </Button>
            )}
            {onSaved && (
              <Button variant="filled-primary" type="submit" disabled={!isValid}>
                {/*TODO: trads*/}
                Enregistrer
              </Button>
            )}
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};
const GenericRuleInput = ({
  ruleMapping,
  form,
}: {
  ruleMapping: Rule['ruleMapping'];
  form: ReturnType<typeof useForm<FormValues>>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'attributes',
  });

  const attributesCount = fields.length;

  const canAddMoreAttributes = ruleMapping.attributesCount !== 'one';
  const canRemoveAttributes =
    (ruleMapping.attributesCount === 'two_or_more' && attributesCount > 2) ||
    (ruleMapping.attributesCount === 'one_or_more' && attributesCount > 1);

  return (
    <div className="flex-1 space-y-6">
      <div className="space-y-4">
        <Title fields={fields} ruleMapping={ruleMapping} />
        <div>
          {canAddMoreAttributes && (
            <Button
              variant="stroke-primary-main"
              size="xs"
              onClick={() => append({})}
              disabled={attributesCount >= MAX_ATTRIBUTES}
            >
              <IconPlus className="h-4 w-4" />
              {/*TODO: trads*/}
              <span>Ajouter un attribut</span>
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <TooltipProvider>
          {fields.map(({ id }, index) => (
            <div key={id} className="flex flex-row items-start gap-4">
              <div className="flex w-[8ch] items-center justify-between pt-1 text-right">
                <DeleteAttributeButton
                  onClick={canRemoveAttributes ? () => remove(index) : null}
                  type="attribute"
                />
                <AttributeIcon index={index} />
                <span className="flex items-center justify-end gap-1 text-label-xs text-sub">
                  :
                </span>
              </div>
              <AttributeField index={index} control={form.control} />
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

const Title = ({
  ruleMapping,
  fields,
}: {
  ruleMapping: Rule['ruleMapping'];
  fields: { id: string }[];
}) => {
  const isEmpty = fields.length === 0;

  const t = useScopedI18n('classes.generate.input.form');
  const emptyTranslation = t(`${ruleMapping.key}.empty`);
  const note = t(`${ruleMapping.key}.note`);
  const hasNote = note !== `${ruleMapping.key}.note`;

  if (isEmpty && emptyTranslation) {
    return (
      <h3 className="space-x-2 text-sub-sm font-medium">
        <span>{emptyTranslation}</span>
        <span className="text-sub-xs text-sub">{hasNote && note}</span>
      </h3>
    );
  }

  const AttributesNodes = fields.map(({ id }, index) => <AttributeIcon key={id} index={index} />);

  const part1 = t(`${ruleMapping.key}.part1`);
  const part2 = t(`${ruleMapping.key}.part2`);

  return (
    <h3 className="space-x-2 text-sub-sm font-medium">
      <span>{part1}</span>
      <span className="space-x-2">{AttributesNodes}</span>
      <span>{part2}</span>
      <span className="text-sub-xs text-sub">{hasNote && note}</span>
    </h3>
  );
};

const addAttributeOption = (
  field: ControllerRenderProps<FormValues, `attributes.${number}`>,
  key: keyof RawAttribute,
) => {
  if (key === 'options') {
    field.onChange({
      ...field.value,
      options: [...(field.value.options ?? []), { option: null }],
    });
  } else if (key === 'genders') {
    field.onChange({
      ...field.value,
      genders: [undefined],
    });
  }
};

const AttributeField = ({ index, control }: { index: number; control: Control<FormValues> }) => {
  return (
    <FormField
      control={control}
      name={`attributes.${index}`}
      render={({ field }) => {
        const hasGenders = field.value.genders != undefined;
        const hasOptions = field.value.options != undefined;
        const hasEmptyValue = !hasGenders || !hasOptions;

        return (
          <FormItem>
            {/*  Add filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="border-2 border-dashed hover:bg-weak data-[state=open]:bg-weak"
                  disabled={!hasEmptyValue}
                >
                  <IconPlus className="h-4 w-4" />
                  {/*TODO: trads*/}
                  <span>Ajouter un filtre</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right">
                <DropdownMenuItem
                  disabled={hasGenders}
                  onClick={() => addAttributeOption(field, 'genders')}
                >
                  {/*TODO: trads*/}
                  Genre
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={hasOptions}
                  onClick={() => addAttributeOption(field, 'options')}
                >
                  {/*TODO: trads*/}
                  Option
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Show filters*/}
            <div className="flex flex-col gap-2 pt-2">
              {attributesFields.map(name => {
                const hasValue = field.value[name] != undefined;
                if (!hasValue) return <div key={name} />;
                return (
                  <div key={name} className="flex items-start gap-2 pl-2">
                    <div className="pt-2" aria-hidden="true">
                      <IconArrowDownRight className="h-4 w-4 text-sub" />
                    </div>
                    {name === 'options' ? (
                      <AttributeOptionField field={field} />
                    ) : name === 'genders' ? (
                      <AttributeGenderField field={field} />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </FormItem>
        );
      }}
    />
  );
};
const AttributeGenderField = ({
  field,
}: {
  field: ControllerRenderProps<FormValues, `attributes.${number}`>;
}) => {
  const tField = useScopedI18n('students.schema.fields');
  const value = field.value.genders?.[0] as (typeof fields.gender.options)[number] | undefined;

  const remove = () => {
    field.onChange({
      ...field.value,
      genders: undefined,
    });
  };

  const update = (v: string) => {
    field.onChange({
      ...field.value,
      genders: [v],
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="stroke-primary-main" size="sm" className="h-10 shrink-0" asChild>
        {/*TODO: trads*/}
        <span>Genre équal à</span>
      </Button>
      <FormControl>
        <Select name={`${field.name}.genders.0`} value={value} onValueChange={v => update(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Genre" className="w-full">
              {/*TODO: trads*/}
              {value ? tField(`gender.options.${value}`) : 'Genre'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {fields.gender.options.map(option => (
              <SelectItem key={option} value={option}>
                {tField(`gender.options.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <DeleteAttributeButton onClick={remove} type="filter" />
    </div>
  );
};

const AttributeOptionField = ({
  field,
}: {
  field: ControllerRenderProps<FormValues, `attributes.${number}`>;
}) => {
  const options = field.value.options;

  const remove = (index: number) => () => {
    const newOptions = field.value.options?.filter((_, i) => i !== index);
    field.onChange({
      ...field.value,
      options: newOptions && newOptions.length > 0 ? newOptions : undefined,
    });
  };

  const update =
    (index: number) => (value: Exclude<RawAttribute['options'], undefined>[number]) => {
      field.onChange({
        ...field.value,
        options: field.value.options?.map((v, i) => (i === index ? value : v)),
      });
    };

  return (
    <div className="flex w-full items-start gap-2">
      <Button variant="stroke-primary-main" size="sm" className="h-10 shrink-0" asChild>
        {/*TODO: trads*/}
        <span>Option égale à</span>
      </Button>
      <div className="w-full space-y-2">
        {options &&
          Object.values(options).map((value, index) => (
            <AttributeOptionFieldSingle
              key={index}
              value={value}
              update={update(index)}
              remove={remove(index)}
              index={index}
            />
          ))}
        <Button
          variant="ghost"
          size="sm"
          className="border-2 border-dashed hover:bg-weak"
          onClick={() => addAttributeOption(field, 'options')}
        >
          <IconPlus className="h-4 w-4" />
          {/*TODO: trads*/}
          <span>Ajouter une option</span>
        </Button>
      </div>
    </div>
  );
};

const generateLevelArray = (
  operator: PartialOperator,
  number: number,
  min: number,
  max: number,
) => {
  switch (operator) {
    case 'eq':
      return [number];
    case 'gte':
      return Array.from({ length: max - number + 1 }, (_, i) => number + i);
    case 'lte':
      return Array.from({ length: number - min + 1 }, (_, i) => min + i);
  }
};

const operatorFromLevelArray = (
  levels: readonly number[] | undefined,
): PartialOperator | undefined => {
  if (levels === undefined || levels.length === 0) {
    return undefined;
  }
  if (levels.length === 1) {
    return 'eq';
  }
  if (levels.length > 1) {
    if (levels[0] === 0) {
      return 'lte';
    }
    return 'gte';
  }
};

const numberFromLevelArray = (
  levels: readonly number[] | undefined,
  operator: PartialOperator | 'none' | undefined,
) => {
  if (levels === undefined || levels.length === 0) {
    return undefined;
  }
  if (operator === 'eq') {
    return levels[0];
  }
  if (operator === 'gte') {
    return levels[0];
  }
  if (operator === 'lte') {
    return levels[levels.length - 1];
  }
};

const AttributeOptionFieldSingle = ({
  value,
  update,
  remove,
  index,
}: {
  value: Exclude<RawAttribute['options'], undefined>[number];
  update: (value: Exclude<RawAttribute['options'], undefined>[number]) => void;
  remove: () => void;
  index: number;
}) => {
  const propertyMapping = useStudentsListStore(state => state.propertyMapping);

  const [operator, setOperator] = React.useState<PartialOperator | 'none' | undefined>(() =>
    operatorFromLevelArray(value.levels),
  );
  const [number, setNumber] = React.useState<number | undefined>(() =>
    numberFromLevelArray(value.levels, operator),
  );
  const tOperator = useScopedI18n('components.datatable.filters.form.operator.names');
  const tFields = useScopedI18n('students.schema.fields');

  const selectedPropertyId = value.option ? value.option.split('.', 2)[1] : undefined;

  const selectedProperty = selectedPropertyId ? propertyMapping[selectedPropertyId] : undefined;
  const propertyType = selectedProperty ? propertyFields[selectedProperty.type] : undefined;

  useEffect(() => {
    if (operator === undefined || number === undefined || propertyType == undefined) return;
    if (propertyType.type === 'number') {
      // TODO: currently only number type is supported
      const levelArray =
        operator === 'none'
          ? undefined
          : generateLevelArray(operator, number, propertyType.min, propertyType.max);
      console.log({ option: value.option, levels: levelArray });
      update({ option: value.option, levels: levelArray });
    }
  }, [value.option, propertyType, operator, number]);

  return (
    <div className="relative flex w-full items-center gap-2">
      {index > 0 && <div className="absolute -left-8 text-sub">et</div>}
      <Select
        value={value.option}
        onValueChange={newValue => update({ ...value, option: newValue as Field })}
      >
        <SelectTrigger className="w-max shrink-0">
          <SelectValue placeholder="Option">
            {/*TODO: trads*/}
            {(selectedPropertyId && propertyMapping[selectedPropertyId]?.name) ?? 'Option'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.values(propertyMapping).map(property => (
            <SelectItem key={property.id} value={`properties.${property.id}`}>
              {property.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={operator} onValueChange={newValue => setOperator(newValue as PartialOperator)}>
        <SelectTrigger className="w-max min-w-32 shrink-0">
          <SelectValue placeholder="Filtre" className="w-full shrink-0">
            {/*TODO: trads*/}
            {operator ? (operator === 'none' ? 'Pas de filtre' : tOperator(operator)) : 'Filtre'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Pas de filtre</SelectItem>
          {partialOperators.map(op => (
            <SelectItem key={op} value={op}>
              {tOperator(op)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {operator && operator !== 'none' && (
        <GenericField
          field={{
            value: number,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setNumber(Number(e.target.value));
            },
          }}
          type={propertyType}
          disabled={!selectedProperty}
          placeholder
          withForm={false}
          // @ts-expect-error: type is incorrect
          t={tFields}
          className="w-32"
        />
      )}

      <DeleteAttributeButton onClick={remove} type="filter" />
    </div>
  );
};

export default GenericRuleInputForm;
