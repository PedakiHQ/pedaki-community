import type { RawRule } from '@pedaki/services/algorithms/generate_classes/input.schema';
import type Class from '../class';
import type { StudentWithClass } from '../entry';
import type Entry from '../entry';
import type { Input } from '../input';
import { Rule, RuleType } from './rule';
import type { StudentValue } from './rule';

/**
 * Respecter les relations négatives entre élèves qui ne veulent pas être dans la même classe.
 */
export class NegativeRelationshipsRule extends Rule {
  protected _ruleType = RuleType.RELATIONSHIPS;

  public constructor(rule: RawRule, input: Input) {
    super(rule, input);
  }

  /**
   * @inheritDoc
   * La valeur correspond au nombre de relations négatives non respectées.
   * Les pires classes sont alors celles ne respectant pas non plus les relations.
   */
  override getStudentValue(entry: Entry, student: StudentWithClass): StudentValue {
    let value = 0;
    const worseClasses: Class[] = [];
    for (const [relationValue, otherStudents] of Object.entries(student.student.relationships())) {
      // On ne prend en compte que les relations négatives.
      if (parseInt(relationValue) >= 0) continue;

      for (const otherStudent of otherStudents) {
        const otherStudentClassId = entry.studentClass(otherStudent)!.id();
        // S'ils sont dans la même classe alors qu'il s'agit d'une relation négative...
        if (student.studentClass.id() == otherStudentClassId) value += -parseInt(relationValue);

        // Il ne doit pas aller dans cette classe, donc on l'ajoute à celles exclues, si ce n'est pas déjà fait.
        const otherStudentClass = entry.class(otherStudentClassId)!;
        if (!worseClasses.includes(otherStudentClass)) worseClasses.push(otherStudentClass);
      }
    }

    return { value, worseClasses };
  }
}
