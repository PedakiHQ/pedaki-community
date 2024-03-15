import type { RawRule } from '@pedaki/services/algorithms/generate_classes/input.schema';
import type { StudentWithClass } from '../entry';
import type Entry from '../entry';
import type { Input } from '../input';
import { Rule, RuleType } from './rule';
import type { StudentValue } from './rule';

/**
 * Respecter les relations positives entre élèves qui veulent être dans la même classe.
 * Respecte une certaine hiérarchie, par exemple lien familial ou simple ami.
 */
export class PositiveRelationshipsRule extends Rule {
  protected _ruleType = RuleType.RELATIONSHIPS;

  public constructor(rule: RawRule, input: Input) {
    super(rule, input);
  }

  /**
   * @inheritDoc
   * La valeur correspond au nombre de relations positives non respectées.
   * Les pires classes sont alors celles ne respectant pas non plus les relations.
   */
  override getStudentValue(entry: Entry, student: StudentWithClass): StudentValue {
    let value = 0;
    const worseClasses = [...entry.classes().values()];
    for (const [relationValue, otherStudents] of Object.entries(student.student.relationships())) {
      // On ne prend en compte que les relations positives.
      if (parseInt(relationValue) <= 0) continue;

      for (const otherStudent of otherStudents) {
        const otherStudentClass = entry.studentClass(otherStudent)!;
        // S'ils ne sont pas dans la même classe alors qu'il s'agit d'une relation positive...
        if (student.studentClass.id() != otherStudentClass.id()) value += parseInt(relationValue);

        // Il doit aller dans cette classe, donc on la retire de celles exclues, si ce n'est pas déjà fait.
        const currentIndex = worseClasses.indexOf(otherStudentClass);
        if (currentIndex >= 0) worseClasses.splice(currentIndex, 1);
      }
    }

    return { value, worseClasses };
  }
}
