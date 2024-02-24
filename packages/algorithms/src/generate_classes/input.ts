import type { Attribute } from './attribute';
import { RuleOrder} from './input.schema';
import type {RawStudent} from './input.schema';
import type { RawInput } from './input.schema';
import type { Rule } from './rules/rule';
import { Student } from './student';

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
