import type { RawRule } from '@pedaki/services/algorithms/generate_classes/input.schema';
import type { Attribute } from '../attribute';
import type { StudentWithClass } from '../entry';
import type Entry from '../entry';
import type { Input } from '../input';
import { Rule, RuleType } from './rule';
import type { StudentValue } from './rule';

/**
 * Répartir équitablement le nombre d'élèves dans chaque classe.
 * Si un attribut est associée à la règle, alors seulement cet attribut sera pris en compte.
 * On n'autorise pas plusieurs attributs pour rester cohérent et compréhensible par rapport aux autres règles.
 * Elle est faite après les répartitions d'attributs.
 *
 * À l'inverse de balance_class_count, on équilibre ici sur toutes les classes, donc il y aura la même différence partout (ou presque).
 * Si on a 22 allemands et 15 anglais, dans des classes de 10, on obtient :
 * Classe 1 : 4 allemands et 3 anglais
 * Classe 2 : 4 allemands et 3 anglais
 * Classe 3 : 5 allemands et 3 anglais
 * Classe 4 : 4 allemands et 3 anglais
 * Classe 4 : 5 allemands et 3 anglais
 */
export class BalanceCountRule extends Rule {
  protected _ruleType = RuleType.ATTRIBUTES;

  constructor(rawRule: RawRule, input: Input) {
    super(rawRule, input);
  }

  /**
   * Associer une valeur relative à la règle d'équilibrage, en fonction d'une certaine disposition.
   * Définit le nombre d'élèves idéal par classe, puis incrémente la valeur pour chaque dénombrement différent.
   */
  override getEntryValue(entry: Entry): number {
    const countGoal = this.getCountPerClass(entry, this.attribute());
    let value = 0;
    for (const classKey of Object.keys(entry.classes())) {
      const count = this.getRelatedStudentsOfClass(entry, classKey);

      // Si personne n'est concerné dans cette classe, on ne fait rien.
      if (!count) continue;

      // On incrémente la différence entre le nombre d'élèves et l'objectif.
      value += Math.abs(this.getDifference(count, countGoal));
    }
    return value;
  }

  /**
   * @inheritDoc
   * Pénalisation de la valeur si l'élève possède un attribut déjà trop présent dans sa classe.
   * Il ne doit pas être déplacé dans les classes qui ont trop l'attribut si lui ne l'a pas, et inversement.
   */
  override getStudentValue(entry: Entry, student: StudentWithClass): StudentValue {
    // Récupération de l'objectif de nombre d'élèves concernés.
    const countGoal = this.getCountPerClass(entry, this.attribute());

    // On récupère la différence entre nombre d'élèves concernés dans sa classe et l'objectif.
    const diff = this.getDifference(
      this.getRelatedStudentsOfClass(entry, student.studentClass.index),
      countGoal,
    );
    const hasAndMore =
      diff > 0 && (!this.attribute() || student.student.hasAttribute(this.attribute()!));

    // On n'attribue pas de mauvaise valeur à ceux qui ont un faible niveau dans une classe trop faible,
    // parce qu'on n'est pas sûr qu'il sera échangé avec quelqu'un du même attribut, il y a trop de risques de tout casser.
    return {
      value: hasAndMore ? Math.abs(diff) : 0,
      worseClasses: entry.classes().filter((_c, classKey) => {
        const classDiff = this.getDifference(
          this.getRelatedStudentsOfClass(entry, classKey),
          countGoal,
        );
        return !this.attribute() || student.student.hasAttribute(this.attribute()!)
          ? classDiff > 0
          : classDiff < 0;
      }),
    };
  }

  /**
   * Obtenir le nombre idéal d'élèves par classe.
   * Prend en compte un éventuel attribut.
   */
  public getCountPerClass = (entry: Entry, attribute?: Attribute): number => {
    if (!attribute) return entry.algo().input().students().length / entry.classes().length;
    return attribute.count() / entry.getClassesWithAttribute(attribute).length;
  };

  /**
   * Obtenir le nombre d'élèves concernés par la règle dans une classe.
   * C'est-à-dire tous les élèves, ou ceux possédant un éventuel attribut défini.
   */
  private getRelatedStudentsOfClass = (entry: Entry, classKey: number | string): number => {
    if (!this.attribute()) return entry.class(classKey)!.students().size;
    return entry.class(classKey)!.count(this.attribute()!);
  };
}
