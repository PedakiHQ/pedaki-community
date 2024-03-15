import type { RawRule } from '@pedaki/services/algorithms/generate_classes/input.schema';
import type Class from '../class';
import type { StudentWithClass } from '../entry';
import type Entry from '../entry';
import type { Input } from '../input';
import type { Student } from '../student';
import type { StudentValue } from './rule';
import { Rule, RuleType } from './rule';

/**
 * Équilibrer le dénombrement de plusieurs attributs dans un maximum de classes.
 * Elle est faite après les répartitions d'attributs.
 * S'adapte à la configuration actuelle des attributs non concernés, et ne modifie pas leur dénombrement.
 *
 * La différence avec balance_count, c'est qu'on équilibre ici les attributs entre eux, à l'intérieur des classes.
 * Dans balance_count, on équilibre chaque attribut individuellement sur l'ensemble des classes.
 * En le représentant de cette manière :
 *
 * Classe 1 : X allemand, X anglais
 * Classe 1 : X allemand, X anglais
 * Classe 1 : X allemand, X anglais
 *
 * Dans cette règle, on équilibre horizontalement, alors que dans balance_count c'est vertical.
 * Il n'y a qu'une seule règle horizontale, c'est celle-ci.
 *
 * On peut par exemple équilibrer l'allemand et l'anglais dans toutes les classes qui en ont.
 * C'est-à-dire qu'on a une répartition parfaite dans chaque classe, sauf la dernière à cause du déséquilibre de base.
 * Si on a 22 allemands et 15 anglais, dans des classes de 10, on obtient :
 * Classe 1 : 5 allemands et 5 anglais
 * Classe 2 : 5 allemands et 5 anglais
 * Classe 3 : 5 allemands et 5 anglais
 * Classe 4 : 5 allemands
 * Classe 5 : 2 allemands
 */
export class BalanceClassCountRule extends Rule {
  protected _ruleType = RuleType.ATTRIBUTES;

  // Pendant l'exécution de cette règle, les classes qu'on peut équilibrer seront toujours les mêmes,
  // parce que le dénombrement des attributs non concernés ne change pas.
  // Le dénombrement ne pourra ensuite pas être changé par les règles suivantes.
  private canBalance = new Map<Class, boolean>();

  // Échantillons d'élèves dans chaque classe. Permet de ne pas réaliser le même déplacement inutile pour 100 élèves identiques.
  // Les classes à ne pas équilibrer sont quand même incluses parce qu'on y déplace des élèves.
  // Redéfini avant chaque application de la règle, puisque des attributs peuvent apparaitre.
  private samples = new Map<Class, Set<Student>>();

  constructor(rawRule: RawRule, input: Input) {
    super(rawRule, input);
  }

  /**
   * Définir une liste d'élèves aléatoire qui représente l'ensemble des cas dans chaque classe.
   * Permet de ne déplacer que le nombre requis d'élèves dans chaque classe, sans omettre aucune possibilité.
   */
  override initialize(entry: Entry) {
    this.samples.clear();
    for (const c of entry.classes().values()) {
      this.samples.set(c, new Set(entry.getStudentSample([...c.students()], this, true)));
      // TODO inclure davantage d'élèves par rapport à la différence de dénombrement dans la classe, seulement si c'est moins long que refaire un tour d'exécution
    }
    // Il faut réinitialiser les valeurs, parce qu'au tour précédent tous ceux dont la valeur était nulle ne doit pas le rester.
    // Elle est réinitialisée au tour précédent seulement lorsque quelqu'un est déplacé, donc lorsque la valeur est positive.
    // Toutes les valeurs calculées après le dernier déplacement ne sont pas réinitialisées et doivent l'être maintenant.
    entry.studentValues().clear();
  }

  /**
   * @inheritDoc
   * Produit de somme des différences de dénombrement des attributs de chaque classe.
   * Les classes qu'on ne peut pas équilibrer (à cause des attributs non concernés) sont ignorées.
   */
  override getEntryValue(entry: Entry): number {
    // On compte la différence entre le dénombrement de chaque attribut dans chaque classe.
    let value = 0;
    for (const c of entry.classes().values()) {
      if (!this.hasClassAttributes(c)) continue;
      if (!this.canBalanceClass(entry, c)) continue;
      const classValue = this.getClassValue(c);
      // Il faut éviter de multiplier par 0, et 0 et 1 doivent bien provoquer une différence.
      // On ne fait donc rien pour le 0, et on incrémente les autres valeurs pour ne pas faire *1.
      if (classValue) {
        if (!value) value = classValue + 1;
        else value *= classValue + 1;
      }
    }

    return value;
  }

  /**
   * @inheritDoc
   * La valeur est positive pour les élèves présents dans l'échantillon d'élèves calculé précédemment.
   */
  override getStudentValue(_entry: Entry, student: StudentWithClass): StudentValue {
    return {
      value: this.samples.get(student.studentClass)!.has(student.student) ? 1 : 0,
      // Il n'y a aucune pire classe, on n'est pas capable de les définir.
      worseClasses: [],
    };
  }

  /**
   * Obtenir l'objectif de dénombrement de chaque attribut dans une certaine classe.
   * Correspond à la moyenne de dénombrement des attributs dans la classe.
   */
  private getClassAvgCount(c: Class): number {
    let sum = 0;
    for (const attribute of this.attributes()) {
      sum += c.count(attribute);
    }
    return sum / this.attributes().length;
  }

  /**
   * Valeur d'une classe, correspondant à la différence de dénombrement de chaque attribut.
   */
  private getClassValue(c: Class) {
    let value = 0;
    const goal = this.getClassAvgCount(c);
    for (const attribute of this.attributes()) {
      // On incrémente la différence entre le dénombrement de l'attribut et l'objectif,
      // en acceptant l'intervalle de l'objectif décimal.
      value += Math.abs(this.getDifference(c.count(attribute), goal));
    }
    return value;
  }

  /**
   * On détermine si les attributs concernés peuvent être équilibrés dans une classe.
   * Pour cela, on dénombre les attributs concernés, parmi ceux non concernés présents dans la classe.
   * Cela signifie que l'on pourrait faire des déplacements pour modifier le dénombrement des attributs concernés,
   * sans changer le dénombrement de ceux non concernés.
   * Par exemple : avec 10 anglais et 5 allemands dans la classe, il faut trouver 10 anglais et 5 allemands de toutes classes pour équilibrer les attributs concernés.
   */
  private canBalanceClass(entry: Entry, c: Class): boolean {
    // On retourne l'éventuelle valeur déjà calculée. Elle est forcément identique pendant toute l'exécution de la règle.
    let result = this.canBalance.get(c);
    if (result !== undefined) return result;

    // On compte les attributs non concernés dans la classe, afin de respecter ce dénombrement plus tard.
    const unrelatedAttributesInClass: Record<string, number> = {};
    for (const student of c.students()) {
      const unrelatedAttributesKey = student.attributesKey(...this.attributes());
      if (!(unrelatedAttributesKey in unrelatedAttributesInClass))
        unrelatedAttributesInClass[unrelatedAttributesKey] = 1;
      else unrelatedAttributesInClass[unrelatedAttributesKey]++;
    }

    // Il faut séparer les attributs non concernés, c'est-à-dire si quelqu'un fait allemand et anglais,
    // il n'est ni dans allemand ni dans anglais, ni dans les deux, mais dans un troisième groupe.
    const attributesAmount: Record<string, Record<string, number>> = {};

    // On dénombre les attributs concernés dans chaque groupe d'attributs non concernés (dans toutes les classes).
    // On arrête de compter lorsqu'on atteint le dénombrement actuel dans la classe.
    for (const student of entry.algo().input().students()) {
      const unrelatedAttributesKey = student.attributesKey(...this.attributes());
      if (!(unrelatedAttributesKey in attributesAmount))
        attributesAmount[unrelatedAttributesKey] = {};

      for (const relatedAttribute of this.attributes()) {
        if (!student.hasAttribute(relatedAttribute)) continue;

        const relatedAttributeKey = relatedAttribute.key();
        const currentAmount = attributesAmount[unrelatedAttributesKey]!;

        if (!(relatedAttributeKey in currentAmount)) currentAmount[relatedAttributeKey] = 0;

        if (
          currentAmount[relatedAttributeKey]! >= unrelatedAttributesInClass[unrelatedAttributesKey]!
        )
          // On arrête de compter puisqu'on a atteint le dénombrement actuel dans la classe.
          continue;

        currentAmount[relatedAttributeKey]++;
      }
    }

    // Obtention de l'objectif de dénombrement de chaque attribut dans la classe.
    const goal = this.getClassAvgCount(c);

    // TODO optimiser : obtenir le bon format de liste directement.
    // On regarde si c'est possible en comptant les attributs concernés. Aucun ne doit être inférieur à l'objectif.
    result = !Object.values(
      Object.entries(attributesAmount)
        .filter(([key]) => key in unrelatedAttributesInClass)
        .reduce(
          (acc, cur) => {
            for (const [key, value] of Object.entries(cur[1])) {
              acc[key] = (acc[key] ?? 0) + value;
            }
            return acc;
          },
          {} as Record<string, number>,
        ),
    ).some(amount => this.getDifference(amount, goal) < 0);
    this.canBalance.set(c, result);
    return result;
  }

  /**
   * Détermine si une certaine classe possède au moins un attribut concerné.
   */
  private hasClassAttributes(c: Class): boolean {
    for (const attribute of this.attributes()) {
      if (c.count(attribute) > 0) return true;
    }

    return false;
  }
}
