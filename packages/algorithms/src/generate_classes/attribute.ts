/**
 * Un attribut peut représenter algorithmiquement :
 * - Une ou plusieurs options
 * - Un ou deux genres
 * - Un ou plusieurs extras (booléens)
 * - Un ou plusieurs niveaux d'option
 */
import type {
  RawAttribute,
  RawAttributeOption,
} from '@pedaki/services/algorithms/generate_classes/input.schema';
import type { Input } from './input';
import type { Student } from './student';

const EMPTY_ARRAY = [] as const;

export class Attribute {
  private readonly attribute: RawAttribute;
  private readonly input: Input;

  // Élèves qui ont cet attribut.
  private readonly _students = new Set<Student>();
  // Indice de l'attribut.
  private _key: number | null = null;
  // Liste des noms d'options.
  private readonly _options: string[];

  constructor(attribute: RawAttribute, input: Input) {
    this.attribute = attribute;
    this.input = input;
    this._options = this.attribute.options?.map(option => option.option) ?? [];
    this._students = new Set(this.correspondingStudents(input.students()));
  }

  public options(): readonly string[] {
    return this._options;
  }

  public optionsWithLevels(): readonly RawAttributeOption[] {
    return this.attribute.options ?? EMPTY_ARRAY;
  }

  public genders(): readonly string[] {
    return this.attribute.genders ?? EMPTY_ARRAY;
  }

  public extras(): readonly string[] {
    return this.attribute.extras ?? EMPTY_ARRAY;
  }

  /**
   * Obtenir le nombre d'élèves qui ont cet attribut.
   */
  public count(): number {
    return this._students.size;
  }

  /**
   * Obtenir la liste des élèves qui ont cet attribut.
   */
  public students() {
    return this._students;
  }

  /**
   * Déterminer si un élève correspond à cet attribut.
   */
  private correspond(student: Student): boolean {
    // S'il n'a pas toutes les options de la liste, il n'est pas concerné.
    if (this.options().some(o => !(o in student.levels()) || typeof student.levels()[o] !== "number")) return false;

    // Pour chacune des options, s'il n'a pas l'un des niveaux associés, il n'est pas concerné non plus.
    for (const option of this.optionsWithLevels()) {
      // Si aucun niveau n'est renseigné, on ignore l'option, puisque cela ne correspond à personne.
      if (!option.levels?.length) continue;
      // Si le niveau de l'élève ne correspond pas à ceux de l'option, il n'est pas concerné.
      if (!option.levels.some(l => student.levels()[option.option] === l)) return false;
    }

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

  private attributeString<T>(name: string, values: readonly T[]): string {
    let string = '';
    if (values.length) {
      string += name + ':(';
      for (const value of values) {
        string += value + ', ';
      }
      string = string.slice(0, -2) + '), ';
    }

    return string;
  }

  public toString(): string {
    let string = 'Attribute{';
    string += this.attributeString('options', this.optionsWithLevels());
    string += this.attributeString('genders', this.genders());
    string += this.attributeString('extras', this.extras());
    return string.slice(0, -2) + '}';
  }
}
