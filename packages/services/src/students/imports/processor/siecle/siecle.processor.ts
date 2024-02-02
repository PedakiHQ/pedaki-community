import { dateWithoutTimezone } from '~/shared/date.ts';
import type { ImportUpload } from '~/students/imports/import.model.ts';
import type {
  ClassImport,
  ClassLevelImport,
  FileProcessor,
  StudentImport,
} from '~/students/imports/processor/processor.ts';
import { parse } from 'csv-parse/sync';
import { z } from 'zod';

const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

const schema = z.object({
  'Nom élève': z.string().min(1).max(255),
  'Prénom élève': z.string().min(1).max(255),
  Niveau: z
    .string()
    .min(1)
    .transform(value => value.toUpperCase()),
  // Cycle: z
  //     .string()
  //     .min(1)
  //     .transform(value => value.toUpperCase()),
  // Regroupement: z.string().max(255),
  Classe: z.string().min(1).max(255), // Class name
  // 'Date inscription': z.string().regex(dateRegex).transform(value => new Date(value)),
  // "Nom d'usage": z.string().min(1).max(255),
  'Deuxième prénom': z.string().optional().default(''),
  'Troisième prénom': z.string().optional().default(''),
  'Date naissance': z
    .string()
    .regex(dateRegex)
    .transform(value => {
      const [day, month, year] = value.split('/', 3).map(Number);
      return dateWithoutTimezone(new Date(year!, month! - 1, day)); // birthdate is a date so we don't care about the time
    }),
  // 'Commune naissance': z.string().min(1).max(255),
  // 'Dépt naissance': z.string().min(1).max(255),
  // 'Pays naissance': z.string().min(1).max(255),
  Sexe: z.enum(['MASCULIN', 'FEMININ']),
  // 'Adresse': z.string().min(1).max(255),
  // 'CP': z.string().min(1).max(255),
  // 'Commune': z.string().min(1).max(255),
  // 'Pays': z.string().min(1).max(255),
  // 'Etat': z.enum(['Définitif']),
});

type SiecleRow = z.infer<typeof schema>;

export class SiecleProcessor implements FileProcessor {
  name = 'siecle' as const;

  #data: SiecleRow[] | null = null;

  #students: StudentImport[] | null = null;
  #levels: ClassLevelImport[] | null = null;
  #classes: ClassImport[] | null = null;

  #parseCSV(buffer: ArrayBuffer): SiecleRow[] {
    const rawData = parse(Buffer.from(buffer), {
      columns: true,
      skip_empty_lines: true,
      encoding: 'utf-8',
      delimiter: ';',
    }) as Record<string, string>[];

    if (rawData.length === 0) {
      throw new Error('EMPTY_FILE');
    }

    return rawData.map(row => {
      return schema.parse(row);
    });
  }

  canProcess(file: ImportUpload): boolean {
    if (file.mimeType !== 'text/csv') {
      return false;
    }

    try {
      this.#data = this.#parseCSV(file.buffer);
      return true;
    } catch (e) {
      return false;
    }
  }

  prepare() {
    const levelNames = this.#data!.map(row => row.Niveau);
    const uniqueLevelNames = [...new Set(levelNames)];
    this.#levels = uniqueLevelNames.map(levelName => ({ name: levelName }));

    const classNames = this.#data!.map(row => row.Niveau + ':' + row.Classe);
    const uniqueClassNames = [...new Set(classNames)];
    this.#classes = uniqueClassNames.map(className => {
      const [level, name] = className.split(':', 2);
      return {
        name: name!,
        _rawLevel: level!,
      };
    });

    this.#students = this.#data!.map(row => ({
      firstName: row['Prénom élève'],
      lastName: row['Nom élève'],
      birthDate: row['Date naissance'],
      otherName: row['Deuxième prénom'] + row['Troisième prénom'] || null,
    }));
  }

  getClassLevels(): ClassLevelImport[] {
    if (this.#levels) {
      return this.#levels;
    }

    throw new Error('Levels not prepared');
  }

  getClasses(): ClassImport[] {
    if (this.#classes) {
      return this.#classes;
    }

    throw new Error('Levels not prepared');
  }

  getStudents(): StudentImport[] {
    if (this.#students) {
      return this.#students;
    }

    throw new Error('Levels not prepared');
  }
}
