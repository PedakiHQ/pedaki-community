import { test } from 'vitest';
import { runTest } from '../../test.ts';

test('Regrouper les options allemand, anglais et espagnol (45 élèves)', async () => {
  return await runTest(
    'users-45.json',
    'input-45-gather-languages.json',
    [
      {
        allemand: {
          count: 10,
        },
        anglais: {
          count: 5,
        },
      },
      {
        espagnol: {
          count: 15,
        },
      },
      {
        anglais: {
          count: 15,
        },
      },
    ],
    ['allemand', 'anglais', 'espagnol'],
  );
});
