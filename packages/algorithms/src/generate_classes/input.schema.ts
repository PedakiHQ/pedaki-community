import type { Input } from '~/generate_classes/input';
import { BalanceClassCountRule } from '~/generate_classes/rules/balance_class_count';
import { BalanceCountRule } from '~/generate_classes/rules/balance_count';
import { GatherAttributesRule } from '~/generate_classes/rules/gather_attributes';
import { MaximizeClassSizeRule } from '~/generate_classes/rules/maximize_class_size';
import { MaximizeClassesRule } from '~/generate_classes/rules/maximize_classes';
import { NegativeRelationshipsRule } from '~/generate_classes/rules/negative_relationships';
import { PositiveRelationshipsRule } from '~/generate_classes/rules/positive_relationships';
import type { Rule } from '~/generate_classes/rules/rule';
import { z } from 'zod';

export const algorithmRules = [
  // Regrouper un ou plusieurs attributs dans un minimum de classes.
  'gather_attributes',
  // Répartir équitablement le nombre d'élèves dans chaque classe.
  // Si un attribut est associée à la règle, alors seulement cet attribut sera pris en compte.
  // Elle est faite après les répartitions d'attributs.
  'balance_count',
  // Équilibrer le dénombrement de plusieurs attributs dans un maximum de classes.
  // Elle est faite après les répartitions d'attributs.
  'balance_class_count',
  // Maximiser le nombre d'élèves dans chaque classe, en respectant les contraintes.
  // Règle inverse de "maximize_classes", ne peut pas être utilisé en même temps.
  'maximize_class_size',
  // Maximiser le nombre de classes, en respectant les contraintes.
  // Règle inverse de "maximize_class_size", ne peut pas être utilisé en même temps.
  'maximize_classes',
  // Respecter les relations positives entre élèves qui veulent être dans la même classe.
  // Respecte une certaine hiérarchie, par exemple lien familial ou simple ami.
  'positive_relationships',
  // Respecter les relations négatives entre élèves qui ne veulent pas être dans la même classe.
  'negative_relationships',
] as const;

export const RuleOrder: Record<
  RuleType,
  { rule: new (rawRule: RawRule, input: Input) => Rule; priority: number }
> = {
  gather_attributes: { rule: GatherAttributesRule, priority: 2 },
  maximize_class_size: { rule: MaximizeClassSizeRule, priority: 2 },
  maximize_classes: { rule: MaximizeClassesRule, priority: 2 },
  positive_relationships: { rule: PositiveRelationshipsRule, priority: 2 },
  negative_relationships: { rule: NegativeRelationshipsRule, priority: 2 },
  balance_count: { rule: BalanceCountRule, priority: 1 },
  balance_class_count: { rule: BalanceClassCountRule, priority: 1 },
};

const RawAttributeOptionSchema = z.object({
  option: z.string(),
  levels: z.number().array().readonly().optional(),
});

export const RawAttributeSchema = z.object({
  options: RawAttributeOptionSchema.array().readonly().optional(),
  genders: z.string().array().readonly().optional(),
  extras: z.string().array().readonly().optional(),
});

export const RawRuleSchema = z.object({
  rule: z.enum(algorithmRules),
  priority: z.number().optional(),
  attributes: RawAttributeSchema.array().optional(),
});

export const RawInputSchema = z.object({
  constraints: z.object({
    class_size_limit: z.number().min(1),
    class_amount_limit: z.number().min(1),
  }),
  rules: RawRuleSchema.array(),
});

export const RawStudentSchema = z.object({
  id: z.string(),
  birthdate: z.date(),
  gender: z.string().or(z.string().array()),
  relationships: z.record(z.number()).optional(),
  levels: z.record(z.number()),
  extra: z.record(z.boolean()).optional(),
});

export type RawAttribute = z.infer<typeof RawAttributeSchema>;
export type RawAttributeOption = z.infer<typeof RawAttributeOptionSchema>;
export type RawRule = z.infer<typeof RawRuleSchema>;
export type RawInput = z.infer<typeof RawInputSchema>;
export type RuleType = (typeof algorithmRules)[number];
export type RawStudent = z.infer<typeof RawStudentSchema>;
