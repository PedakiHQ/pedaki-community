/**
 * Un attribut peut représenter algorithmiquement :
 * - Une ou plusieurs options
 * - Un ou deux genres
 * - Un ou plusieurs extras (booléens)
 * - Un ou plusieurs niveaux d'option
 */
import type { Input, RawAttribute } from './input.ts';
import type { Gender, Student } from './student.ts';

export class Attribute {
  private readonly attribute: RawAttribute;
  private readonly input: Input;

  // Élèves qui ont cet attribut.
  private readonly _students: Student[] = [];
  // Indice de l'attribut.
  private _key: number | null = null;

  constructor(attribute: RawAttribute, input: Input) {
    this.attribute = attribute;
    this.input = input;
    this._students = this.correspondingStudents(input.students());
  }

  public options(): string[] {
    if (Array.isArray(this.attribute.options)) return this.attribute.options;
    if (!this.attribute.options) return [];
    return [this.attribute.options];
  }

  public option(): string {
    if (Array.isArray(this.attribute.options)) return this.attribute.options[0];
    return this.attribute.options!;
  }

  public levels(): number[] {
    if (Array.isArray(this.attribute.levels)) return this.attribute.levels;
    if (this.attribute.levels === undefined) return [];
    return [this.attribute.levels];
  }

  public genders(): Gender[] {
    if (Array.isArray(this.attribute.genders)) return this.attribute.genders;
    if (!this.attribute.genders) return [];
    return [this.attribute.genders];
  }

  public extras(): string[] {
    if (Array.isArray(this.attribute.extras)) return this.attribute.extras;
    if (!this.attribute.extras) return [];
    return [this.attribute.extras];
  }

  /**
   * Obtenir le nombre d'élèves qui ont cet attribut.
   */
  public count(): number {
    return this._students.length;
  }

  /**
   * Obtenir la liste des élèves qui ont cet attribut.
   */
  public students(): Student[] {
    return this._students;
  }

  /**
   * Déterminer si un élève correspond à cet attribut.
   */
  private correspond(student: Student): boolean {
    // S'il n'a pas toutes les options de la liste, il n'est pas concerné.
    if (this.options().some(o => !(o in student.levels()))) return false;

    // S'il n'a pas l'un des niveaux de la liste pour chaque option, il n'est pas concerné non plus.
    if (
      this.levels().length &&
      this.options().some(o => !this.levels().some(l => student.levels()[o] === l))
    )
      return false;

    // S'il n'a pas le ou les genres de la liste, il n'est toujours pas concerné.
    if (this.genders().some(g => !student.genders().includes(g))) return false;

    // S'il n'a pas les extras de la liste, il n'est encore une fois pas concerné.
    if (this.extras().some(e => !student.extras().includes(e))) return false;

    // L'élève correspond à l'attribut.
    return true;
  }

  /**
   * Calculer et définir les valeurs constantes.
   */
  private correspondingStudents(students: Student[]) {
    return students.filter(s => this.correspond(s));
  }

  /**
   * Obtenir l'unique clé de cet attribut.
   * Il s'agit de l'indice dans la liste d'attributs de l'input.
   */
  public key(): number {
    if (this._key === null) this._key = this.input.keyOfAttribute(this);
    return this._key;
  }
}
