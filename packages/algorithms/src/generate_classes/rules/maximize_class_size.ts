import type { StudentWithClass } from '../entry.ts';
import type Entry from '../entry.ts';
import type { Input, RawRule } from '../input.ts';
import { Rule, RuleType } from './rule.ts';
import type { StudentValue } from './rule.ts';

/**
 * Maximiser le nombre d'élèves dans chaque classe, en respectant les contraintes.
 * Règle inverse de "maximize_classes", ne peut pas être utilisé en même temps.
 */
export class MaximizeClassSizeRule extends Rule {
  protected _ruleType = RuleType.CONSTRAINTS;

  constructor(rawRule: RawRule, input: Input) {
    super(rawRule, input);
  }

  /**
   * On compte une pénalité pour chaque classe qui n'est pas au maximum, relative à la place restante.
   */
  override getEntryValue(entry: Entry): number {
    // On retourne la somme de la place libre dans chaque classe.
    return entry
      .classes()
      .map(c => entry.algo().input().classSize() - c.getStudents().length)
      .reduce((acc, cur) => acc + cur, 0);
  }

  /**
   * @inheritDoc
   * La valeur retournée correspond au nombre de places vides dans la classe.
   * Les pires classe sont alors toutes celles qui ont moins d'élèves que celle actuelle.
   */
  override getStudentValue(entry: Entry, student: StudentWithClass): StudentValue {
    return {
      value: entry.algo().input().classSize() - student.studentClass.class.getStudents().length,
      worseClasses: entry
        .classes()
        .filter(c => c.getStudents().length < student.studentClass.class.getStudents().length),
    };
  }
}
