import type { RawRule } from '@pedaki/services/algorithms/generate_classes/input.schema';
import type Entry from '../entry';
import type { StudentWithClass } from '../entry';
import type { Input } from '../input';
import type { StudentValue } from './rule';
import { Rule, RuleType } from './rule';

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
      .map(c => entry.algo().input().classSize() - c.students().size)
      .reduce((acc, cur) => acc + cur, 0);
  }

  /**
   * @inheritDoc
   * La valeur retournée correspond au nombre de places vides dans la classe.
   * Les pires classe sont alors toutes celles qui ont moins d'élèves que celle actuelle.
   */
  override getStudentValue(entry: Entry, student: StudentWithClass): StudentValue {
    return {
      value: entry.algo().input().classSize() - student.studentClass.class.students().size,
      worseClasses: entry
        .classes()
        .filter(c => c.students().size < student.studentClass.class.students().size),
    };
  }

  /**
   * Le pourcentage de respect correspond ici au nombre minimum de classes par rapport au nombre actuel.
   * @param entry
   */
  override getRespectPercent(entry: Entry): number {
    // Obtention du nombre minimum de classes, par rapport au nombre d'élèves et à la taille maximale des classes.
    const minClassAmount =
      entry.algo().input().students().length / entry.algo().input().classSize();

    return minClassAmount / entry.classes().length;
  }
}
