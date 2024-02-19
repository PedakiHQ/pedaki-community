import type { Attribute } from './attribute.ts';
import { BalanceClassCountRule } from './rules/balance_class_count.ts';
import { BalanceCountRule } from './rules/balance_count.ts';
import { GatherAttributesRule } from './rules/gather_attributes.ts';
import { MaximizeClassSizeRule } from './rules/maximize_class_size.ts';
import { MaximizeClassesRule } from './rules/maximize_classes.ts';
import { NegativeRelationshipsRule } from './rules/negative_relationships.ts';
import { PositiveRelationshipsRule } from './rules/positive_relationships.ts';
import type { Rule } from './rules/rule.ts';
import { Student } from './student.ts';
import type { Gender, RawStudent } from './student.ts';

export interface RawInput {
  constraints: {
    class_size_limit: number;
    class_amount_limit: number;
  };
  rules: RawRule[];
}

export interface RawRule {
  rule: LevelRuleType;
  priority?: number;
  attributes: RawAttribute[];
}

export interface RawAttribute {
  options?: string | string[];
  levels?: number | number[];
  genders?: Gender | Gender[];
  extras?: string | string[];
}

export type LevelRuleType =
  // Regrouper un ou plusieurs attributs dans un minimum de classes.
  | 'gather_attributes'
  // Répartir équitablement le nombre d'élèves dans chaque classe.
  // Si un attribut est associée à la règle, alors seulement cet attribut sera pris en compte.
  // Elle est faite après les répartitions d'attributs.
  | 'balance_count'
  // Équilibrer le dénombrement de plusieurs attributs dans un maximum de classes.
  // Elle est faite après les répartitions d'attributs.
  | 'balance_class_count'
  // Maximiser le nombre d'élèves dans chaque classe, en respectant les contraintes.
  // Règle inverse de "maximize_classes", ne peut pas être utilisé en même temps.
  | 'maximize_class_size'
  // Maximiser le nombre de classes, en respectant les contraintes.
  // Règle inverse de "maximize_class_size", ne peut pas être utilisé en même temps.
  | 'maximize_classes'
  // Respecter les relations positives entre élèves qui veulent être dans la même classe.
  // Respecte une certaine hiérarchie, par exemple lien familial ou simple ami.
  | 'positive_relationships'
  // Respecter les relations négatives entre élèves qui ne veulent pas être dans la même classe.
  | 'negative_relationships';

const RuleOrder: Record<
  LevelRuleType,
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

export class Input {
  private readonly input: RawInput;
  private _students: Record<string, Student> = {};

  // Liste de tous les attributs, permettant de leur associer un unique identifiant.
  private _attributes: Attribute[] = [];
  // Liste complète des instances de règles, dans l'ordre défini par les priorités de l'utilisateur et les nôtres.
  private _rules = new Map<Rule, number>();
  // Niveau minimal des d'options.
  private _minLevel: number = Number.MAX_VALUE;
  // Niveau maximal des options.
  private _maxLevel: number = -Number.MAX_VALUE;

  constructor(input: RawInput, students: RawStudent[]) {
    this.input = input;

    this.calculate(students);
  }

  /**
   * Obtenir la liste des règles.
   */
  public rules() {
    return this._rules;
  }

  public ruleKey(rule: Rule) {
    return this._rules.get(rule);
  }

  /**
   * Obtenir la liste des élèves.
   */
  public students(): Student[] {
    return Object.values(this._students);
  }

  public student(id: string): Student | undefined {
    if (!(id in this._students)) return undefined;
    return this._students[id];
  }

  public attributes(): Attribute[] {
    return this._attributes;
  }

  public keyOfAttribute(attribute: Attribute): number {
    return this._attributes.indexOf(attribute);
  }

  /**
   * Calculer les statistiques relatives aux données initiales, une seule fois.
   */
  private calculate(rawStudents: RawStudent[]) {
    for (const s of rawStudents) {
      for (const level of Object.values(s.levels)) {
        if (level > this._maxLevel) this._maxLevel = level;
        if (level < this._minLevel) this._minLevel = level;
      }
    }

    // On les instancie après parce qu'on a besoin des niveaux min et max.
    for (const rawStudent of rawStudents) {
      const student = new Student(rawStudent, this);
      if (student.id() in this._students)
        throw new Error(`There are two or more students with id ${student.id()}`);
      this._students[parseInt(student.id())] = student;
    }

    const rules: Rule[] = [];
    for (const rawRule of Object.values(this.input.rules)) {
      if (!(rawRule.rule in RuleOrder)) {
        console.error(`Unknown rule ${rawRule.rule}`);
        continue;
      }
      rules.push(new RuleOrder[rawRule.rule].rule(rawRule, this));
    }

    rules.sort((r1, r2) => {
      // On vérifie d'abord si notre priorité peut les départager.
      if (RuleOrder[r1.key()].priority != RuleOrder[r2.key()].priority)
        return RuleOrder[r2.key()].priority - RuleOrder[r1.key()].priority;
      // Si notre priorité est la même pour les deux, on les départage avec la priorité de l'utilisateur.
      return r2.priority() - r1.priority();
    });

    this._attributes = [];
    for (const [key, rule] of Object.entries(rules)) {
      this._rules.set(rule, parseInt(key));
      this.attributes().push(...rule.attributes());
    }

    // Définir la liste des affinités de chaque élève.
    for (const student of Object.values(this._students)) {
      if (!student.raw().relationships) continue;
      for (const [studentId, value] of Object.entries(student.raw().relationships!)) {
        const otherStudent = this.student(studentId)!;
        this.prepareRelationships(value, student, otherStudent);
        this.prepareRelationships(value, otherStudent, student);
      }
    }
  }

  private prepareRelationships(index: number, student1: Student, student2: Student) {
    const relationship = student1.relationships()[index];
    if (relationship === undefined) {
      student1.relationships()[index] = [student2];
    } else {
      if (relationship.includes(student2)) return;
      relationship.push(student2);
    }
  }

  public classSize(): number {
    return this.input.constraints.class_size_limit;
  }

  public classAmount(): number {
    return this.input.constraints.class_amount_limit;
  }

  public minLevel(): number {
    return this._minLevel;
  }

  public maxLevel(): number {
    return this._maxLevel;
  }

  public raw(): RawInput {
    return this.input;
  }
}
