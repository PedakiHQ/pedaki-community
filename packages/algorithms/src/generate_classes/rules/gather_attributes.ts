import type { Attribute } from '../attribute';
import type { StudentWithClass } from '../entry';
import type Entry from '../entry';
import type { Input } from '../input';
import type { RawRule } from '../input.schema';
import { Rule, RuleType } from './rule';
import type { StudentValue } from './rule';

/**
 * Regrouper un ou plusieurs attributs dans un minimum de classes.
 */
export class GatherAttributesRule extends Rule {
  protected _ruleType = RuleType.ATTRIBUTES;

  constructor(rawRule: RawRule, input: Input) {
    super(rawRule, input);
  }

  /**
   * Associer une valeur relative à la règle de regroupement d'attributs en fonction d'une certaine disposition.
   * Prend en compte une liste de classes qui doivent contenir les attributs, et incrémente la valeur pour chaque élève mal placé.
   */
  override getEntryValue(entry: Entry): number {
    return Object.values(this.getExcludedClasses(entry)).reduce((acc, cur) => acc + cur, 0);
  }

  /**
   * @inheritDoc
   * L'élève peut être déplacé dans les classes qui regroupent un ou plusieurs de ses attributs.
   * Si aucune classe n'est concernée, alors on lui fait éviter les classes qui regroupent un attribut.
   */
  override getStudentValue(entry: Entry, student: StudentWithClass): StudentValue {
    // Récupération des classes qui ne doivent pas contenir les attributs.
    const excludedClasses = this.getExcludedClasses(entry);

    // S'il a l'un des attributs, il ne doit pas être dans une classe qui ne les regroupe pas.
    if (student.student.hasAttribute(...this.attributes())) {
      const studentClassIndex = student.studentClass.index.toString();
      const excludedClassValue = excludedClasses[studentClassIndex];

      // S'il est dans une classe qui regroupe les attributs, il est déjà bien placé.
      // Sinon, on retourne le nombre d'élèves bien placés (s'il est le seul mal placé, il est vraiment très mal placé).
      // Les pires classes sont celles qui ne regroupent pas les attributs.
      return {
        value:
          excludedClassValue === undefined
            ? 0
            : entry.algo().input().classSize() - excludedClassValue,
        worseClasses: Object.keys(excludedClasses).map(classKey => entry.class(classKey)!),
      };
    }

    // Dans tous les autres cas, il est bien placé et n'a pas de classe interdite.
    return {
      value: 0,
      worseClasses: [],
    };
  }

  /**
   * Retourne la liste des classes qui ne doivent pas contenir certains attributs.
   * Associe à chaque indice de classe, le nombre d'élèves qui ont les attributs (et qui ne devraient donc pas les avoir).
   */
  public getExcludedClasses = (
    entry: Entry,
    attributes: Attribute[] = this.attributes(),
  ): Record<string, number> => {
    // On dénombre les élèves concernés.
    let studentsAmount;
    if (attributes.length === 1) studentsAmount = attributes[0]!.count();
    else {
      // Il ne suffit pas d'additionner chaque dénombrement d'attribut, puisque chaque élève peut posséder plusieurs des attributs concernés.
      studentsAmount = entry
        .algo()
        .input()
        .students()
        .filter(student => student.hasAttribute(...attributes)).length;
    }

    // Estimer le nombre de classes requises au minimum si on regroupe correctement.
    const classesNeeded = Math.ceil(studentsAmount / entry.algo().input().classSize());

    // Exclure les classes ayant le plus les attributs.
    return Object.fromEntries(
      Object.keys(entry.classes())
        .map(
          classKey =>
            [classKey, entry.class(classKey)?.count(...this.attributes()!) ?? 0] as [
              string,
              number,
            ],
        )
        .sort((a, b) => a[1] - b[1])
        .slice(0, -classesNeeded),
    );
  };
}
