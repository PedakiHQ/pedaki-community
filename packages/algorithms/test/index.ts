import * as assert from 'assert';
import * as path from 'path';
import * as url from 'url';
import Algorithm from '../src/generate_classes/algorithm.ts';
import type Class from '../src/generate_classes/class.ts';
import type { RawInput } from '../src/generate_classes/input.ts';
import type { RawStudent } from '../src/generate_classes/student.ts';
import { fixtures, readJsonFile } from './fixtures.ts';

// Classe modèle ayant pour but d'être comparée à une véritable classe pour déterminer leur égalité.
interface OptionValueOutputClass {
  count: number;
  levels?: number[];
}
type OptionOutputClass = Record<string, OptionValueOutputClass>;
interface IdOutputClass {
  ids?: number[][];
}
export type OutputClass = { total?: string } & OptionOutputClass & IdOutputClass;

export interface Module {
  studentsFile: string;
  inputFile: string;
  keysMask: string[];
  skip?: boolean;
  output: OutputClass[];
  // Pourcentage minimum de respect de chaque règle, d'après l'indice après tri.
  respectPercents?: number[];
  showLevel?: boolean;
  showIds?: boolean;
  description?: string;
}
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('get classes from input', function () {
  fixtures(__dirname, 'rules', async ({ module }: { module: Module }) => {
    const {
      studentsFile,
      inputFile,
      keysMask = [],
      output,
      respectPercents,
      showLevel,
      showIds,
    } = module;

    return Promise.all([
      Promise.resolve((await readJsonFile(studentsFile)) as Promise<RawStudent[]>),
      Promise.resolve((await readJsonFile(inputFile)) as Promise<RawInput>),
    ]).then(([students, input]) => {
      const algo = new Algorithm(students, input);
      const { entry, duration, rules } = algo.solve();
      console.log(module.description);
      console.log(`duration: ${duration}`);
      for (const [i, { respect_percent }] of Object.entries(rules)) {
        console.log(`respect percent of rule ${i}: ${respect_percent}`);
      }
      console.log(entry.toString(showLevel, showIds, ...keysMask));

      if (respectPercents) {
        for (const [i, { respect_percent }] of Object.entries(rules)) {
          if (!(i in respectPercents)) break;
          assert.equal(
            respect_percent < respectPercents[parseInt(i)],
            false,
            `Respect percent of rule ${i} (${respect_percent}) does not match requirement (${
              respectPercents[parseInt(i)]
            }).`,
          );
        }
      }

      if (output) {
        assert.equal(entry.classes().length, output.length);

        // On vérifie que chaque classe du résultat était bien dénombrée à l'identique dans le test.
        const classesToValidate = entry.classes();
        let minClassesMatching = 1;
        while (classesToValidate.length) {
          for (const outputClass of output) {
            const validClasses = classesToValidate.filter(c => c && isClassValid(c, outputClass));
            assert.notEqual(validClasses.length, 0, 'Cant find a valid model for a resulted class');
            if (validClasses.length > minClassesMatching) continue;
            classesToValidate.splice(classesToValidate.indexOf(validClasses[0]), 1);
            output.splice(output.indexOf(outputClass), 1);
          }
          ++minClassesMatching;
        }
      }
    });
  });
});

/**
 * Comparer deux objets sans prendre en compte l'ordre des clés.
 */
const isClassValid = (c: Class, model: OutputClass): boolean => {
  const isValueDifferent = (actual: any, expected: any): boolean => {
    if (!!expected && !actual) return true;

    // Si la valeur est une liste de deux nombres, on accepte l'intervalle.
    if (
      Array.isArray(expected) &&
      expected.length === 2 &&
      typeof expected[0] === 'number' &&
      typeof expected[1] === 'number'
    ) {
      // On accepte l'intervalle.
      const min = Math.min(expected[0], expected[1]);
      const max = Math.max(expected[0], expected[1]);
      if (actual < min || actual > max) return true;
    }

    // Si c'est une liste de plus de 2 nombres, ce sont uniquement eux qu'on accepte.
    else if (Array.isArray(expected) && expected.length > 2 && !expected.includes(actual))
      return true;
    // Si la valeur est un nombre, on les compare
    else if (typeof expected === 'number' && expected != actual) return true;

    return false;
  };

  // Vérifier qu'une option correspond à sa description.
  const optionDiffers = (option: string, value: OptionValueOutputClass): boolean => {
    // Comparaison du dénombrement de l'option (ou genre ou extra).
    if (isValueDifferent(c.manualCount(option), value.count)) return true;

    // Comparaison du dénombrement de chaque niveau.
    if (value.levels) {
      for (const [level, count] of Object.entries(value.levels)) {
        if (isValueDifferent(c.manualCount(option, level), count)) return true;
      }
    }

    return false;
  };

  for (const [key, value] of Object.entries(model)) {
    // S'il s'agit de la clé indiquant le dénombrement global, c'est uniquement ça que l'on compare.
    if (key === 'total') {
      if (isValueDifferent(c.students().size, value)) return false;
      continue;
    }

    // S'il s'agit de la clé de comparaison des identifiants, ce sont uniquement eux que l'on compare.
    if (key === 'ids') {
      // Si aucune liste d'identifiants ne correspond, alors la classe n'est pas valide.
      const studentIds = [...c.students()].map(student => parseInt(student.id()));
      if (
        !(value as unknown as number[][]).find(
          ids => studentIds.length === ids.length && !ids.find(id => !studentIds.includes(id)),
        )
      )
        return false;
      continue;
    }

    // On vérifie que la description de l'option correspond.
    if (optionDiffers(key, value)) return false;
  }

  return true;
};
