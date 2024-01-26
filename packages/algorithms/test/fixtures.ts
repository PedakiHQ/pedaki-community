import fs from 'fs';
import { basename, extname, resolve } from 'path';
import { Module } from './index.ts';

export async function readJsonFile(path: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

// Réaliser récursivement les tests sur toute l'arborescence, via une fonction et des dossiers passés en paramètre.
export const fixtures = (...args: any[]) => {
  let fn = args.pop();
  let options = { skip: false };

  // On récupère éventuellement les options si c'est le dernier paramètre.
  if (typeof fn !== 'function') {
    options = fn;
    fn = args.pop();
  }

  // Obtenir le dossier et la liste des fichiers.
  const path = resolve(...args);
  const files = fs.readdirSync(path);
  const dir = basename(path);
  const d = options.skip ? describe.skip : describe;

  // Effectuer le test décrit par la fonction sur tous les fichiers.
  d(dir, () => {
    for (const file of files) {
      const p = resolve(path, file);
      const stat = fs.statSync(p);

      // Si c'est un dossier, on fait la même chose récursivement pour tous ses fichiers.
      if (stat.isDirectory()) {
        fixtures(path, file, fn);
      }

      // On vérifie que c'est un fichier de test valide, puis on réalise le test.
      if (
        stat.isFile() &&
        (file.endsWith('.js') || file.endsWith('.ts')) &&
        file !== 'fixtures.js' &&
        !file.startsWith('.') &&
        // On ignore `index.js` pour pouvoir utiliser les fichiers à son niveau.
        file !== 'index.js'
      ) {
        const name = basename(file, extname(file));

        // Réalisation du test en exécutant la fonction passée.
        it(`${name} `, async function () {
          const module: Module = await import('file://' + p);

          // Si ce test est désactivé, on l'ignore.
          if (module.skip) {
            this.skip();
            return;
          }

          // On réalise le test en exécutant la fonction sur ce fichier.
          return fn({ name, path, module });
        }).timeout(30000);
      }
    }
  });
};

// Permettre de désactiver un module entier de tests.
fixtures.skip = (...args: any[]) => {
  fixtures(...args, { skip: true });
};
