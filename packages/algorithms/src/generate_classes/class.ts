import type { Attribute } from './attribute.ts';
import type Entry from './entry.ts';
import type { Rule } from './rules/rule.ts';
import type { Student } from './student.ts';

export interface ClassWithIndex {
  class: Class;
  index: number;
}

export default class Class {
  private _students = new Set<Student>();

  // Nombre d'élèves ayant chaque attribut dans la classe.
  private attributesCount = new Map<number, number>();

  constructor(students: Student[]) {
    for (const student of students) {
      this.addStudent(student);
    }
  }

  /**
   * Obtenir la liste des élèves présents dans cette classe.
   */
  public students() {
    return this._students;
  }

  /**
   * Obtenir le nombre d'élèves qui possèdent certains attributs dans la classe.
   */
  public count(...attributes: (Attribute | number)[]): number {
    return attributes
      .map(
        attribute =>
          this.attributesCount.get(typeof attribute === 'number' ? attribute : attribute.key()) ??
          0,
      )
      .reduce((acc, cur) => acc + cur);
  }

  /**
   * Retirer un élève de la classe.
   */
  public removeStudent(student: Student) {
    this._students.delete(student);

    for (const attribute of student.attributes()) {
      const count = this.attributesCount.get(attribute.key());
      if (count === undefined) continue;
      if (count == 1) this.attributesCount.delete(attribute.key());
      else this.attributesCount.set(attribute.key(), count - 1);
    }
  }

  /**
   * Ajouter un élève à la classe.
   */
  public addStudent(student: Student) {
    this._students.add(student);

    for (const attribute of student.attributes()) {
      const count = this.attributesCount.get(attribute.key());
      if (count === undefined) this.attributesCount.set(attribute.key(), 1);
      else this.attributesCount.set(attribute.key(), count + 1);
    }
  }

  /**
   * Déterminer si cette classe est égale à une autre, en comparant la liste des élèves.
   */
  public equals(other: Class): boolean {
    if (other._students.size != this._students.size) return false;

    for (const s1 of this._students) {
      if (other._students.has(s1)) return false;
    }

    return true;
  }

  /**
   * Déterminer si cette classe est égale à une autre, en ne comparant que les dénombrements.
   */
  public equalsCount(other: Class): boolean {
    for (const [attribute, count] of Object.entries(this.attributesCount)) {
      if (other.count(parseInt(attribute)) != count) return false;
    }

    return true;
  }

  /**
   * Trouver l'élève idéal pour aller dans cette classe.
   * Doit prendre en compte les précédentes règles et leur priorité.
   * On peut donner une liste d'élèves dont les équivalents seront ignorés.
   */
  public findBestStudentFor(
    entry: Entry,
    students: Student[],
    toRule: Rule,
    ...ignoreStudents: Student[]
  ): Student {
    // On récupère une liste réduite d'élèves, mais qui contient quand même l'ensemble des cas.
    const sample = entry.getStudentSample(students, toRule, false, ...ignoreStudents);
    let bestValues: number[] | undefined = undefined;
    let bestStudent: Student | undefined = undefined;

    // On teste le nombre de règles respectées pour chaque élève, s'il est déplacé dans la classe.
    const classIndex = entry.classes().indexOf(this);
    for (const student of sample) {
      const studentInitialClass = entry.studentClass(student)!;

      // On effectue le déplacement de l'élève dans cette classe.
      entry.moveStudent(student, {
        class: this,
        index: classIndex,
      });

      const values: number[] = [];
      for (const rule of entry.algo().input().rules().keys()) {
        const index = entry.algo().input().ruleKey(rule)!;

        // On récupère la valeur de la configuration pour cette règle.
        const value = entry.value(rule);

        // Si la valeur est déjà supérieure à la meilleure, on abandonne cette configuration.
        if (bestValues && value > bestValues[index]) break;

        // On définit la valeur de cette règle avec cette configuration.
        values[index] = value;

        // Si on a atteint la règle limite, on ne va pas plus loin pour cette configuration.
        if (rule === toRule) break;
      }

      if (!bestValues || values.length === bestValues.length) {
        bestValues = values;
        bestStudent = student;
      }

      // On annule le déplacement.
      entry.moveStudent(student, studentInitialClass);
    }

    return bestStudent!;
  }

  /**
   * Uniquement utilisé dans les tests, pas besoin de stocker la valeur.
   * Permet de s'assurer que le dénombrement stocké est correct.
   */
  manualCount(option: string, level?: number | string): number {
    let count = 0;
    for (const student of this.students()) {
      if (option in student.levels() && (level === undefined || student.levels()[option] == level))
        count++;
    }
    return count;
  }

  toString(showLevel?: boolean, showIds?: boolean, ...keysMask: string[]) {
    let str = `Class{students: ${this._students.size}, `;
    if (showIds) return str + `ids: (${[...this._students].map(s => s.id()).join(',')})}`;

    const attributeCount: Record<string, number> = {};
    const levelCount: Record<string, Record<number, number>> = {};

    for (const student of this._students) {
      for (const [attribute, level] of Object.entries(student.levels())) {
        attributeCount[attribute] = attributeCount[attribute] ? attributeCount[attribute] + 1 : 1;
        if (!levelCount[attribute]) levelCount[attribute] = {};
        levelCount[attribute][level] = levelCount[attribute][level]
          ? levelCount[attribute][level] + 1
          : 1;
      }
    }

    for (const [option, count] of Object.entries(attributeCount)) {
      if (!keysMask.includes(option)) continue;
      str += `${option}: ${count}`;
      if (showLevel && Object.keys(levelCount[option]).length > 1) {
        str += ' (';
        for (const [level, c] of Object.entries(levelCount[option])) {
          str += `${level}: ${c}, `;
        }
        str = str.slice(0, -2) + ')';
      }
      str += ', ';
    }

    return str.slice(0, -2) + '}';
  }
}