import type { Attribute } from './attribute';
import type { Input } from './input';

export interface RawStudent {
  id: string;
  birthdate: Date;
  gender: string | string[];
  relationships?: Record<string, number>;
  // Je pars du principe que les niveaux présents indiquent les options choisies
  levels: Record<string, number>;
  extra?: Record<string, boolean>;
}

/**
 * Chaque instance d'élève est unique et commune à toutes les configurations.
 */
export class Student {
  private readonly student: RawStudent;
  private readonly input: Input;

  // Liste des "caractéristiques" de l'élève, associé à chaque niveau.
  // Contient les options, genres et extras.
  private readonly _levels: Record<string, number>;

  // Liste des attributs correspondants à l'élève.
  private _attributes: Set<Attribute> | undefined;

  // Liste des niveaux de relations (positives et négatives), avec les élèves relatifs à chaque niveau.
  private _relationships: Record<number, Student[]> | null = {};

  constructor(student: RawStudent, input: Input) {
    this.student = student;
    this.input = input;

    this._levels = this.student.levels;
    for (const gender of this.genders()) {
      this._levels = { ...this._levels, [gender as string]: input.maxLevel() };
    }
    for (const extra of this.extras()) {
      this._levels = { ...this._levels, [extra]: input.maxLevel() };
    }
  }

  public id(): string {
    return this.student.id;
  }

  public levels(): Record<string, number> {
    return this._levels;
  }

  public genders(): string[] {
    if (Array.isArray(this.student.gender)) return this.student.gender;
    return [this.student.gender];
  }

  public extras(): string[] {
    if (!this.student.extra) return [];
    return Object.entries(this.student.extra)
      .filter(([, bool]) => !!bool)
      .map(([key]) => key);
  }

  /**
   * Obtenir la liste des attributs de règles qui correspondent à l'élève.
   */
  public attributes() {
    // On ne définit qu'une seule fois la liste des attributs.
    if (this._attributes === undefined) {
      this._attributes = new Set<Attribute>();
      for (const attribute of this.input.attributes()) {
        if (attribute.students().has(this)) this._attributes.add(attribute);
      }
    }

    return this._attributes;
  }

  /**
   * Savoir si deux élèves sont identiques du point de vue des attributs.
   */
  public equals(other: Student): boolean {
    if (other.attributes().size !== this.attributes().size) return false;
    for (const attribute of this.attributes()) {
      if (!other.hasAttribute(attribute)) return false;
    }
    return true;
  }

  /**
   * Savoir si l'élève possède au moins un attribut parmi une liste.
   */
  public hasAttribute(...attributes: Attribute[]): boolean {
    for (const attribute of attributes) {
      if (this._attributes?.has(attribute)) return true;
    }
    return false;
  }

  public relationships() {
    return this._relationships!;
  }

  public raw() {
    return this.student;
  }

  /**
   * Obtention d'une clé représentant une liste d'attributs.
   */
  public attributesKey(...ignore: Attribute[]): string {
    let key = '';
    for (const attribute of this.attributes()) {
      if (ignore.includes(attribute)) continue;
      if (key.length) key += '-';
      key += attribute.key();
    }

    return key;
  }
}
