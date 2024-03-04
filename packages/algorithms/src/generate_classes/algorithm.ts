import type {
  RawInput,
  RawStudent,
} from '@pedaki/services/algorithms/generate_classes/input.schema';
import type { Output } from '@pedaki/services/algorithms/generate_classes/output.schema';
import Entry from './entry';
import { Input } from './input';

export const DEFAULT_PRIORITY = 1;

/**
 * On exécute une liste de règles dans un certain ordre.
 * On attend que chaque règle soit entièrement respectée, ou déclarée non compatible, pour passer à la suite.
 * La validation d'une règle se détermine par la valeur de la solution qui doit être nulle.
 * La modification des solutions est guidée par des valeurs associées à chaque élève,
 * relative à son placement et à la règle courante, ainsi qu'une liste de destinations envisageables.
 */
export class GenerateClassesAlgorithm {
  private readonly _input: Input;
  private _entry?: Entry;

  constructor(students: RawStudent[], rawInput: RawInput) {
    this._input = new Input(rawInput, students);
  }

  public input() {
    return this._input;
  }

  public entry() {
    return this._entry;
  }

  public solve(): Output {
    const startTime = Date.now();
    this._entry = Entry.default(this);
    const output: Partial<Output> = {};

    // On fait respecter chaque règle en respectant l'ordre de priorité.
    for (const rule of this.input().rules().keys()) {
      // On effectue les déplacements jusqu'à ce que cette règle soit respectée, ou que plus aucun déplacement ne soit possible.
      let moves = Number.MAX_VALUE;
      while (this._entry.value(rule) > 0 && moves > 0) {
        // On effectue les déplacements voulus por la règle courante.
        moves = this._entry.moveStudents(rule);
      }
    }

    // Récupération des pourcentages de respect de chaque règle.
    output.rules = [];
    for (const rule of this.input().rules().keys()) {
      output.rules[rule.initialIndex()] = { respect_percent: rule.getRespectPercent(this._entry) };
    }

    output.classes = [...this._entry.classes().values()].map(c => ({
      students: [...c.students()].map(s => s.id()),
    }));
    output.duration = (Date.now() - startTime) / 1000;
    return output as Output;
  }
}
