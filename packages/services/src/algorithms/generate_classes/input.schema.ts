import { FieldSchema } from '~/students/query.model.client.ts';
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

const RawAttributeOptionSchema = z.object({
  option: FieldSchema, // todo refinement
  levels: z.number().array().min(1).readonly().optional(),
});

export const RawAttributeSchema = z
  .object({
    options: RawAttributeOptionSchema.array().min(1).readonly().optional(),
    genders: z.string().array().min(1).readonly().optional(),
    extras: z.string().array().min(1).readonly().optional(),
  })
  .refine(value => {
    // at least one of the properties must be defined
    return value.options !== undefined || value.genders !== undefined || value.extras !== undefined;
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
