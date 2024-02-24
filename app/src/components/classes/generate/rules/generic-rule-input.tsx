import { zodResolver } from '@hookform/resolvers/zod';
import type { RawAttribute } from '@pedaki/algorithms';
import { RawAttributeSchema } from '@pedaki/algorithms/generate_classes/input.schema.js';
import { Button } from '@pedaki/design/ui/button';
import { DialogFooter } from '@pedaki/design/ui/dialog';
import {
    Form, FormControl,
    FormField,
    FormItem, FormMessage,
} from '@pedaki/design/ui/form';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger,
} from "@pedaki/design/ui/dropdown-menu"
import type { RuleMappingValue } from '~/components/classes/generate/rules/constants.ts';
import { useScopedI18n } from '~/locales/client.ts';
import React from 'react';
import {useFieldArray, useForm  } from 'react-hook-form';
import type {Control, ControllerRenderProps, UseFieldArrayUpdate} from 'react-hook-form';
import {IconArrowDownRight, IconPlus} from "@pedaki/design/ui/icons";
import {TooltipProvider} from "@pedaki/design/ui/tooltip";
import { z } from 'zod';
import { toast } from 'sonner';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@pedaki/design/ui/select";
import {useStudentsListStore} from "~/store/students/list/list.store.ts";
import { DeleteAttributeButton } from './delete-attribute-button';
import {MAX_ATTRIBUTES} from "~/components/classes/generate/rules/constants.ts";
import AttributeIcon from "~/components/classes/generate/rules/attribute-icon.tsx";
import { fields } from '~/components/students/import/student/constants';

type Rule = {
  ruleMapping: RuleMappingValue;
  defaultValues?: RawAttribute[];
  onCanceled?: () => void;
  onDeleted?: () => void;
  onSaved?: (rule: RuleMappingValue) => void;
} & (
  | { onCanceled: () => void; onSaved: (rule: RuleMappingValue) => void }
  | { onDeleted: () => void }
);

interface FormValues { attributes: RawAttribute[] } // TODO weird type


const attributesFields : readonly (keyof RawAttribute)[] = ['genders', 'options'];

const GenericRuleInputForm = (props: Rule) => {
    const {onCanceled, onDeleted, onSaved, ruleMapping} = props;

    const form = useForm<FormValues>({
        resolver: zodResolver(z.object({attributes: RawAttributeSchema.array()})),
        mode: 'onChange',
        defaultValues: {attributes: props.defaultValues ?? ruleMapping.attributesCount === 'one' ? [{}] : ruleMapping.attributesCount === 'two_or_more' ? [{}, {}] : []},
    });

    return (
        <div className="flex flex-col h-full">
            <Form {...form}>
                <GenericRuleInput form={form} ruleMapping={ruleMapping} />
                <pre>
                    {JSON.stringify(form.getValues(), null, 2)}
                </pre>
            </Form>

    <DialogFooter>
        {onCanceled && (
            <Button variant="stroke-primary-main" onClick={onCanceled} type="button">
                {/*TODO: trads*/}
                Retour
            </Button>
        )}
        {onDeleted && (
            <Button variant="stroke-danger-main" onClick={onDeleted} type="button">
                {/*TODO: trads*/}
                Supprimer
            </Button>
        )}
        {onSaved && (
            <Button variant="filled-primary" onClick={() => onSaved(ruleMapping)}>
                {/*TODO: trads*/}
                Enregistrer
            </Button>
        )}
    </DialogFooter>
</div>
    );
}
const GenericRuleInput = ({ ruleMapping, form }: {ruleMapping: Rule['ruleMapping'], form: ReturnType<typeof useForm<FormValues>>}) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'attributes'
    });

  const attributesCount = fields.length;

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const canAddMoreAttributes = ruleMapping.attributesCount === 'two_or_more';
  const canRemoveAttributes = ruleMapping.attributesCount === 'two_or_more' && attributesCount > 2;

  return (
      <div className="space-y-6 flex-1">
          <div className="space-y-4">
              <h3 className="text-sub-sm font-medium">
                  <span>Equilibrer</span>
                  <span className="px-2 space-x-2">
                    {fields.map(({id}, index) => (<AttributeIcon key={id} index={index} />))}
                  </span>
                  <span>
                  entre toutes les classes
                      </span>
              </h3>
              {canAddMoreAttributes && (
                  <Button
                      variant="stroke-primary-main"
                      size="xs"
                      onClick={() => append({})}
                      disabled={attributesCount >= MAX_ATTRIBUTES}
                  >
                      <IconPlus className="h-4 w-4" />
                      <span>Ajouter un attribut</span>
                  </Button>
              )}
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4">
              <TooltipProvider>
                    {fields.map(({id}, index) => (
                      <div key={id} className="flex flex-row gap-4 items-start">
                          <div className="w-[8ch] text-right flex items-center justify-between  pt-1">
                              <DeleteAttributeButton onClick={canRemoveAttributes ? () => remove(index) : null}
                                                     type="attribute"
                              />
                              <AttributeIcon index={index} />
                              <span className="flex justify-end items-center gap-1 text-sub text-label-xs">
                                  :
                              </span>
                          </div>
                        <AttributeField index={index} control={form.control}/>
                      </div>
                    ))}
              </TooltipProvider>
          </form>
      </div>
  );
};



const addAttributeOption = (field: ControllerRenderProps<FormValues, `attributes.${number}`>, key: keyof RawAttribute) => {
    if(key === 'options') {
        field.onChange({
            ...field.value,
            options: [
                ...(field.value.options ?? []),
                { option: null },
            ],
        });
    }
    else if(key === 'genders') {
        field.onChange({
            ...field.value,
            genders: [undefined],
        });
    } else {
        toast.error('Impossible d\'ajouter cet attribut');
    }
}

const AttributeField = ({ index, control } : { index: number, control: Control<FormValues> }) => {
  return (
      <FormField
          control={control}
          name={`attributes.${index}`}
          render={({ field }) => {
            const hasGenders = field.value.genders != undefined;

            return (
                <FormItem>
                  {/*  Add filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="border-dashed border-2 hover:bg-weak data-[state=open]:bg-weak">
                          <IconPlus className="h-4 w-4" />
                            <span>Ajouter un filtre</span>
                      </Button>
                    </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" side="right">
                          <DropdownMenuItem disabled={hasGenders} onClick={() => addAttributeOption(field, 'genders')}>Genre</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addAttributeOption(field, 'options')}>Option</DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>

                    {/* Show filters*/}
                    <div className="flex flex-col gap-2 pt-2">
                        {attributesFields.map((name) => {
                            const hasValue = field.value[name] != undefined;
                            if(!hasValue) return <div key={name} />
                            return  (
                                <div key={name} className="flex items-start gap-2 pl-2">
                                    <div className="pt-2">
                                        <IconArrowDownRight className="h-4 w-4 text-sub" />
                                    </div>
                                    {name === 'options' ? (
                                        <AttributeOptionField field={field} />
                                    ) : name === 'genders' ? (
                                        <AttributeGenderField field={field} />
                                    ) : null}
                                </div>
                            )
                        })}
                    </div>

                </FormItem>
            );
          }}
        />
  )
}
const AttributeGenderField = ({ field }: { field: ControllerRenderProps<FormValues, `attributes.${number}`> }) => {

    const tField = useScopedI18n("students.schema.fields");
    const value = field.value.genders?.[0] as typeof fields.gender.options[number] | undefined;

    const remove = () => {
        field.onChange({
            ...field.value,
            genders: undefined,
        });
    }

    const update = (v: string) => {
        field.onChange({
            ...field.value,
            genders: [v],
        });
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="stroke-primary-main" size="sm" className="shrink-0" asChild>
                <span>Genre équal à</span>
            </Button>

                    <FormControl>
                        <Select
                            name={`${field.name}.genders.0`}
                            value={value}
                            onValueChange={(v) => update(v)}
                            defaultValue={value}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="TODO trads" className="w-full">
                                    {value ? tField(`gender.options.${value}`) : "TODO trads"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {fields.gender.options
                                    .map(option => (
                                        <SelectItem key={option} value={option}>
                                            {tField(`gender.options.${option}`)}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </FormControl>

            <DeleteAttributeButton
                onClick={remove}
                type="filter"
            />
        </div>
    )
}

const AttributeOptionField = ({ field }: { field: ControllerRenderProps<FormValues, `attributes.${number}`> }) => {

    const options = field.value.options;

    const remove = (index: number) => () => {
        const newOptions = field.value.options?.filter((_, i) => i !== index);
        field.onChange({
            ...field.value,
            options: (newOptions && newOptions.length > 0) ? newOptions : undefined,
        });
    }

    const update = (index: number) => (value: Exclude<RawAttribute['options'], undefined>[number]) => {
        field.onChange({
            ...field.value,
            options: field.value.options?.map((v, i) => i === index ? value : v),
        });
    }

    return (
            <div className="flex gap-2 items-start">
                <div className="shrink-0 space-y-2">
                    <Button variant="stroke-primary-main" size="sm" className="shrink-0" asChild>
                        <span>Option égale à</span>
                    </Button>
                </div>
                <div className="w-full space-y-2">
                    {options && Object.values(options).map((value, index) => (
                        <AttributeOptionFieldSingle key={index} value={value} update={update(index)} remove={remove(index)} />
                    ))}
            </div>
        </div>
    )
}

const AttributeOptionFieldSingle = ({ value, update, remove }: {
    value: Exclude<RawAttribute['options'], undefined>[number],
    update: (value: Exclude<RawAttribute['options'], undefined>[number]) => void,
    remove: () => void
}) => {

    const propertyMapping = useStudentsListStore(state => state.propertyMapping);

    return (
        <div className="flex items-center gap-2">
            <FormControl>
                <Select
                    value={value.option}
                    onValueChange={(newValue) => update({ ...value, option: newValue })}
                    defaultValue={value.option}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="TODO trads" className="w-full">
                            {(value && propertyMapping[value.option]?.name) ?? "TODO trads"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(propertyMapping).map((property) => (
                            <SelectItem key={property.id} value={String(property.id)}>
                                {property.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormControl>

            <DeleteAttributeButton
                onClick={remove}
                type="filter"
            />
        </div>
    )

}


export default GenericRuleInputForm;
