import type Algorithm from './algorithm.ts';
import type { Attribute } from './attribute.ts';
import Class from './class.ts';
import type { ClassWithIndex } from './class.ts';
import { RuleType } from './rules/rule.ts';
import type { Rule, StudentValue } from './rules/rule.ts';
import { Student } from './student.ts';

export interface StudentWithClass {
  student: Student;
  studentClass: ClassWithIndex;
}

/**
 * Instance de solution possible au problème.
 * Représente donc une liste de classes.
 */
export default class Entry {
  private readonly _algo: Algorithm;
  private _classes: Class[];

  // La valeur actuelle de cette configuration pour chaque règle. Elle est invalidée à chaque modification.
  private _values: Record<string, number> = {};

  // La valeur de chaque élève pour chaque règle, invalidées à chaque modification.
  private _studentValues: Record<string, Record<string, StudentValue>> = {};

  // L'indice de la classe actuelle de chaque élève.
  private _studentClass: Record<string, number> = {};

  constructor(algo: Algorithm, classes: Class[]) {
    this._algo = algo;
    this._classes = classes;

    // On définit une seule fois la position de chaque élève, pour ne pas devoir chercher ensuite.
    for (const [index, c] of Object.entries(classes)) {
      for (const student of c.getStudents()) {
        this._studentClass[student.id()] = parseInt(index);
      }
    }
  }

  public classes() {
    return this._classes;
  }

  public algo() {
    return this._algo;
  }

  public clone() {
    return new Entry(this.algo(), [...this.classes().map(c => new Class([...c.getStudents()]))]);
  }

  public class(index: number | string): Class | null {
    const intIndex: number = typeof index === 'string' ? parseInt(index) : index;

    if (!(intIndex in this._classes)) return null;
    return this._classes[intIndex];
  }

  public getClassesWithAttribute(attribute: Attribute) {
    return this.classes().filter(c => c.count(attribute));
  }

  public studentClass(student: Student): ClassWithIndex | null {
    if (!(student.id() in this._studentClass)) return null;
    return {
      index: this._studentClass[student.id()],
      class: this.classes()[this._studentClass[student.id()]],
    };
  }

  public getStudents(): StudentWithClass[] {
    return this.classes()
      .map((c, i) =>
        c
          .getStudents()
          .map(student => ({ student, studentClass: { class: c, index: i } as ClassWithIndex })),
      )
      .flat();
  }

  /**
   * Obtenir la valeur de cette configuration, relative à une règle.
   */
  public value(rule: Rule): number {
    const index = this.algo().input().rules().indexOf(rule);
    if (!(index in this._values)) this._values[index] = rule.getEntryValue(this);
    return this._values[index];
  }

  /**
   * Obtenir la valeur d'un élève dans cette configuration, relativement à une règle.
   */
  public studentValue(student: Student | StudentWithClass, rule: Rule): StudentValue {
    // On récupère la classe actuelle de l'élève.
    if (student instanceof Student)
      student = { student, studentClass: this.studentClass(student)! };

    if (!(student.student.id() in this._studentValues))
      this._studentValues[student.student.id()] = {};
    const index = this.algo().input().rules().indexOf(rule);
    if (!(index in this._studentValues[student.student.id()]))
      this._studentValues[student.student.id()][index] = rule.getStudentValue(this, student);
    return this._studentValues[student.student.id()][index];
  }

  /**
   * Suppression d'une classe dans cette configuration.
   */
  public deleteClass(classIndex: number) {
    this.classes().splice(classIndex, 1);
  }

  /**
   * Déplacer un élève dans une autre classe.
   * Permet d'actualiser les différentes données de la configuration actuelle (sans tout recalculer).
   */
  public moveStudent(student: Student, to: ClassWithIndex) {
    this.studentClass(student)!.class.removeStudent(student);
    to.class.addStudent(student);

    // On invalide la valeur de la configuration puisqu'elle a changé.
    this._values = {};
    this._studentValues = {};

    // On modifie l'indice de l'élève concerné.
    this._studentClass[student.id()] = to.index;
  }

  public static default(algo: Algorithm): Entry {
    const length = Math.ceil(algo.input().students().length / algo.input().classSize());
    return new Entry(
      algo,
      Array.from(
        { length },
        (_v, k) =>
          new Class(
            algo
              .input()
              .students()
              .slice(
                k * algo.input().classSize(),
                k * algo.input().classSize() + algo.input().classSize(),
              ),
          ),
      ),
    );
  }

  /**
   * Déplacer les élèves mal placés dans la configuration actuelle.
   * Prend en compte une règle d'objectif qui va tenter d'être respectée.
   * Retourne le nombre de déplacements effectués (chaque déplacement améliore le respect de la règle).
   */
  public moveStudents(rule: Rule): number {
    // Obtenir la liste de tous les élèves, triés par valeur décroissante.
    const allStudents = this.getStudents().sort(
      (a, b) => this.studentValue(b, rule).value - this.studentValue(a, rule).value,
    );

    // On compte le nombre de déplacements réalisés (ils ne sont réalisés que s'ils sont bénéfiques).
    let moves = 0;

    // On déplace tous les élèves mal placés dans des classes suggérées.
    for (const student of allStudents) {
      // On applique un changement relatif à cet élève et cette règle.
      if (this.applyRuleForStudent(student.student, rule)) moves++;

      // Si le changement précédent a permis de respecter la règle, on s'arrête là.
      if (this.value(rule) === 0) break;
    }

    return moves;
  }

  /**
   * Obtenir la liste des classes envisageables pour un élève.
   * S'il ne doit pas être déplacé, rien n'est retourné.
   */
  private getStudentBestClasses(student: StudentWithClass, rule: Rule): Class[] | undefined {
    // Récupération de la valeur de placement de l'élève, relative à la règle courante, ainsi que la liste des classes à éviter.
    const { value, worseClasses } = this.studentValue(student, rule);

    // Si l'élève est déjà bien placé, on ne fait rien de plus.
    if (value <= 0) return undefined;

    // On ajoute la classe actuelle de l'élève dans les classes ignorées.
    if (!worseClasses.includes(student.studentClass.class)) {
      worseClasses.push(student.studentClass.class);
    }

    // Ajouter des pires classes des règles précédentes.
    for (const r of this.algo().input().rules()) {
      if (r === rule) break;
      worseClasses.push(
        ...this.studentValue(student, r).worseClasses.filter(c => !worseClasses.includes(c)),
      );
    }

    return this.classes().filter(c => !worseClasses.includes(c));
  }

  /**
   * Déplacer un élève dans une autre classe, en prenant en compte l'éventuel échange nécessaire.
   */
  private moveAndExchangeStudent(
    student: StudentWithClass,
    rule: Rule,
    destination?: Class,
  ): { student: StudentWithClass; to: ClassWithIndex; exchanged?: Student } | undefined {
    if (!destination) {
      // Si on a atteint le nombre maximum de classes, on ne fait rien.
      if (this.classes().length >= this.algo().input().classAmount()) return undefined;
      // Création d'une nouvelle classe si aucune n'est définie.
      destination = new Class([]);
      this.classes().push(destination);
    }

    // Récupération de la liste d'élèves disponibles pour un éventuel échange.
    // C'est-à-dire sans l'élève qui va être rajouté, pour éviter que l'échange annule tout.
    const studentsForExchange = [...destination.getStudents()];

    const to = {
      class: destination,
      index: this.classes().indexOf(destination),
    };

    // Déplacer l'élève dans l'autre classe.
    this.moveStudent(student.student, to);

    // On l'échange avec un élève de sa nouvelle classe si elle est pleine.
    if (destination.getStudents().length > this.algo().input().classSize()) {
      // Déterminer l'élève de la classe de destination avec qui échanger.
      // On ignore tous les élèves qui sont équivalents en terme d'attributs.
      const exchanged: Student | null = student.studentClass.class.findBestStudentFor(
        this,
        studentsForExchange,
        rule,
        student.student,
      );

      // Si on n'a pas trouvé d'élève différent qu'on pourrait échanger, on abandonne.
      if (!exchanged) {
        this.moveStudent(student.student, student.studentClass);
        return undefined;
      }

      // Déplacer cet élève dans la classe initiale du premier élève (échanger).
      this.moveStudent(exchanged, student.studentClass);
      return { student, to, exchanged };
    }

    // Supprimer la classe s'il n'y a plus d'élèves dedans.
    if (student.studentClass?.class.getStudents().length === 0)
      this.deleteClass(student.studentClass.index);

    return { student, to };
  }

  /**
   * Déterminer si cette configuration est moins bien qu'une autre, jusqu'à une certaine règle (non incluse).
   */
  private isRegression(target: Entry, toRule: Rule): boolean {
    for (const r of this.algo().input().rules()) {
      if (r === toRule) break;
      if (this.value(r) > target.value(r)) return true;
    }
    return false;
  }

  /**
   * Appliquer une règle sur un élève afin de le déplacer dans la bonne classe.
   * Un éventuel échange est effectué pour respecter la limite de taille de classe.
   * Chaque destination envisageable est testée pour que la meilleure soit choisie.
   */
  private applyRuleForStudent(student: Student, rule: Rule): boolean {
    // Obtenir la liste des destinations envisageables pour l'élève.
    const destinations: (Class | undefined)[] | undefined = this.getStudentBestClasses(
      { student, studentClass: this.studentClass(student)! },
      rule,
    );
    if (!destinations) return false;
    if (!destinations.length) destinations.push(undefined);

    // Création des variables de recherche de la meilleure configuration.
    let bestEntry = null,
      bestValue = Number.MAX_VALUE;

    // On réalise le déplacement dans chaque destination séparément et on prend le meilleur résultat.
    for (let destination of destinations) {
      // Création d'une nouvelle configuration à partir de celle-ci.
      const entry = this.clone();
      if (destination) destination = entry.class(this.classes().indexOf(destination))!;

      // Réalisation du déplacement, avec un potentiel échange.
      if (
        !entry.moveAndExchangeStudent(
          { student, studentClass: entry.studentClass(student)! },
          rule,
          destination,
        )
      )
        continue;

      // On compare cette nouvelle configuration pour trouver la meilleure.
      // Si cette configuration est moins bien concernant les règles précédentes, on l'ignore.
      if (!entry.isRegression(this, rule) && entry.value(rule) < bestValue) {
        bestEntry = entry;
        bestValue = entry.value(rule);
      }
    }

    // On indique en retour si ce changement a été bénéfique ou non.
    if (bestEntry && bestValue < this.value(rule)) {
      // On applique les modifications dans cette configuration.
      this._classes = bestEntry.classes();
      this._values = bestEntry._values;
      this._studentValues = bestEntry._studentValues;
      return true;
    }

    return false;
  }

  /**
   * Obtenir un échantillon d'élèves qui représente l'ensemble des cas.
   */
  public getStudentSample(
    students: Student[],
    toRule?: Rule,
    ...ignoreStudents: Student[]
  ): Student[] {
    // Il faut gérer les relations si une règle correspond.
    const handleRelationships = !!this.algo()
      .input()
      .rules()
      .filter(
        (r, i) =>
          r.ruleType() === RuleType.RELATIONSHIPS &&
          (!toRule || this.algo().input().rules().indexOf(toRule) >= i),
      ).length;
    // On supprime tous les doublons d'élèves qui ont les mêmes attributs sans affinité.
    return students.reduce(
      (acc, cur) => {
        // Si la liste d'attributs de cet élève n'est pas encore représentée dans la liste, ou s'il a des affinités, on ajoute l'élève.
        if (
          (handleRelationships && Object.entries(cur.relationships()).length) ||
          !acc.some(
            s =>
              s.attributes().length === cur.attributes().length &&
              !s.attributes().some(a => !cur.attributes().includes(a)),
          )
        )
          acc.push(cur);
        return acc;
      },
      [...ignoreStudents],
    );
  }

  /**
   * Déterminer si une classe est égale à une autre.
   * Peut ne prendre en compte que les dénombrements.
   */
  public equals(entry: Entry, onlyCount?: boolean): boolean {
    if (entry.classes().length != this.classes().length) return false;

    for (const c1 of this.classes()) {
      for (const c2 of entry.classes()) {
        if (!onlyCount && !c1.equals(c2)) return false;
        if (onlyCount && !c1.equalsCount(c2)) return false;
      }
    }

    return true;
  }

  toString(showLevel?: boolean, showIds?: boolean, ...keysMask: string[]) {
    let str = '';
    for (const c of this.classes()) {
      str += '- ' + c.toString(showLevel, showIds, ...keysMask) + '\n';
    }

    return str;
  }
}
