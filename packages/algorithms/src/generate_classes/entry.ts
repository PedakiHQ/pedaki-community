import type { GenerateClassesAlgorithm } from './algorithm';
import type { Attribute } from './attribute';
import type { ClassWithIndex } from './class';
import Class from './class';
import type { Rule, StudentValue } from './rules/rule';
import { RuleType } from './rules/rule';
import { Student } from './student';

export interface StudentWithClass {
  student: Student;
  studentClass: ClassWithIndex;
}

/**
 * Instance de solution possible au problème.
 * Représente donc une liste de classes.
 */
export default class Entry {
  private readonly _algo: GenerateClassesAlgorithm;
  private _classes: Class[];

  // La valeur actuelle de cette configuration pour chaque règle. Elle est invalidée à chaque modification.
  private _values = new Map<Rule, number>();

  // La valeur de chaque élève pour chaque règle, invalidées à chaque modification.
  private _studentValues = new Map<Rule, Map<Student, StudentValue>>();

  // L'indice de la classe actuelle de chaque élève.
  private _studentClass = new Map<Student, number>();

  constructor(algo: GenerateClassesAlgorithm, classes: Class[]) {
    this._algo = algo;
    this._classes = classes;

    // On définit une seule fois la position de chaque élève, pour ne pas devoir chercher ensuite.
    for (const [index, c] of Object.entries(classes)) {
      for (const student of c.students()) {
        this._studentClass.set(student, parseInt(index));
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
    return new Entry(this.algo(), [...this.classes().map(c => new Class([...c.students()]))]);
  }

  public class(index: number | string): Class | null {
    const intIndex: number = typeof index === 'string' ? parseInt(index) : index;

    return this._classes[intIndex] ?? null;
  }

  public getClassesWithAttribute(attribute: Attribute) {
    return this.classes().filter(c => c.count(attribute));
  }

  public studentClass(student: Student): ClassWithIndex | null {
    if (!this._studentClass.has(student)) return null;
    const index = this._studentClass.get(student)!;
    return {
      index: index,
      class: this.classes()[index]!,
    };
  }

  public students(): StudentWithClass[] {
    return this.classes()
      .map((c, i) => {
        const array = [];
        for (const student of c.students()) {
          array.push({
            student,
            studentClass: { class: c, index: i } as ClassWithIndex,
          });
        }
        return array;
      })
      .flat();
  }

  /**
   * Obtenir la valeur de cette configuration, relative à une règle.
   */
  public value(rule: Rule): number {
    let value = this._values.get(rule);
    if (value === undefined) {
      value = rule.getEntryValue(this);
      this._values.set(rule, value);
    }
    return value;
  }

  public studentValues() {
    return this._studentValues;
  }

  public values() {
    return this._values;
  }

  /**
   * Obtenir la valeur d'un élève dans cette configuration, relativement à une règle.
   */
  public studentValue(student: Student | StudentWithClass, rule: Rule): StudentValue {
    let map = this._studentValues.get(rule);
    if (!map) {
      map = new Map<Student, StudentValue>();
      this._studentValues.set(rule, map);
    }

    // On récupère la classe actuelle de l'élève.
    if (student instanceof Student)
      student = { student, studentClass: this.studentClass(student)! };

    let value = map.get(student.student);
    if (!value) {
      value = rule.getStudentValue(this, student);
      map.set(student.student, value);
    }
    return value;
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

    // On invalide la valeur de la configuration pour chaque règle.
    this._values.clear();
    this._studentValues.clear();

    // On modifie l'indice de l'élève concerné.
    this._studentClass.set(student, to.index);
  }

  public static default(algo: GenerateClassesAlgorithm): Entry {
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
    // On initialise chaque règle précédente pour une nouvelle exécution.
    for (const r of this.algo().input().rules().keys()) {
      rule.initialize(this);
      if (rule === r) break;
    }

    // Obtenir la liste de tous les élèves, triés par valeur décroissante.
    // On ne filtre pas les valeurs nulles ici, parce qu'elles peuvent évoluer après chaque déplacement.
    const allStudents = this.students().sort(
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

    // On n'utilise pas les pires classes des règles précédentes puisque ça pourrait retirer de réelles possiblités.
    // Les retours en arrière sont de toute façon impossible car testés dans "applyRuleForStudent()".

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
    const studentsForExchange = [...destination.students()];

    const to = {
      class: destination,
      index: this.classes().indexOf(destination),
    };

    // Déplacer l'élève dans l'autre classe.
    this.moveStudent(student.student, to);

    // On l'échange avec un élève de sa nouvelle classe si elle est pleine.
    if (destination.students().size > this.algo().input().classSize()) {
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
    if (student.studentClass?.class.students().size === 0)
      this.deleteClass(student.studentClass.index);

    return { student, to };
  }

  /**
   * Déterminer si cette configuration est moins bien qu'une autre, jusqu'à une certaine règle (non incluse).
   */
  private isRegressionOf(target: Entry, toRule: Rule): boolean {
    for (const r of this.algo().input().rules().keys()) {
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
  private applyRuleForStudent(student: Student | StudentWithClass, rule: Rule): boolean {
    if (student instanceof Student)
      student = { student, studentClass: this.studentClass(student)! };

    // Obtenir la liste des destinations envisageables pour l'élève.
    const destinations: (Class | undefined)[] | undefined = this.getStudentBestClasses(
      student,
      rule,
    );
    if (!destinations) return false;
    if (!destinations.length) destinations.push(undefined);

    // On clone la configuration de base, afin de pouvoir la comparer ensuite à ce qu'on va générer.
    const fromEntry = this.clone();

    // Création des variables de recherche de la meilleure configuration.
    let bestResult = null,
      bestValue = Number.MAX_VALUE;

    // On réalise le déplacement dans chaque destination séparément et on prend le meilleur résultat.
    for (const [index, destination] of Object.entries(destinations)) {
      // Réalisation du déplacement, avec un potentiel échange.
      let result;
      if (!(result = this.moveAndExchangeStudent(student, rule, destination))) continue;

      // Récupération de la valeur de cette modification, afin de savoir si elle est bénéfique et la meilleure possible.
      const value = this.value(rule);

      // On compare cette nouvelle configuration pour trouver la meilleure.
      // Si cette configuration est moins bien concernant les règles précédentes, on l'ignore.
      if (value < bestValue && !this.isRegressionOf(fromEntry, rule)) {
        bestResult = result;
        bestValue = value;

        // Si c'était la dernière destination à tester, on s'arrête tel-quel.
        if (index == (destinations.length - 1).toString()) return true;
      }

      // Annulation du déplacement, afin de revenir à la configuration initiale.
      this.moveStudent(student.student, student.studentClass);
      if (result.exchanged) this.moveStudent(result.exchanged, result.to);
    }

    // On indique en retour si ce changement a été bénéfique ou non.
    if (bestResult && bestValue < fromEntry.value(rule)) {
      // On applique de nouveau les déplacements de la meilleure configuration trouvée.
      this.moveStudent(student.student, bestResult.to);
      if (bestResult.exchanged) this.moveStudent(bestResult.exchanged, student.studentClass);
      return true;
    }

    return false;
  }

  /**
   * Obtenir un échantillon d'élèves qui représente l'ensemble des cas.
   */
  public getStudentSample(
    students: Student[],
    toRule: Rule,
    ignorePreviousRules?: boolean,
    ...ignoreStudents: Student[]
  ): Student[] {
    // Il faut gérer les relations si une règle correspond.
    const handleRelationships = toRule.hasType(this, RuleType.RELATIONSHIPS, !ignorePreviousRules);

    // On supprime tous les doublons d'élèves qui ont les mêmes attributs sans affinité.
    return students
      .reduce(
        (acc, cur) => {
          // Si la liste d'attributs de cet élève n'est pas encore représentée dans la liste, ou s'il a des affinités, on ajoute l'élève.
          if (
            (handleRelationships && Object.entries(cur.relationships()).length) ||
            !acc.some(s => s.equals(cur))
          )
            acc.push(cur);
          return acc;
        },
        // On les inclut, puis ils seront filtrés après.
        // Permet d'ignorer tous les élèves qui sont identiques, sans parcourir 2 listes à chaque fois.
        // La copie est nécessaire au filtrage qui suit, afin qu'elles restent bien différentes.
        [...ignoreStudents],
      )
      .filter(student => !ignoreStudents.includes(student));
  }

  toString(showLevel?: boolean, showIds?: boolean, ...keysMask: string[]) {
    let str = '';
    for (const c of this.classes()) {
      str += '- ' + c.toString(showLevel, showIds, ...keysMask) + '\n';
    }

    return str;
  }
}
