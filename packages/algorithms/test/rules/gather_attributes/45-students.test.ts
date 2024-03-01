import { test } from 'vitest';
import { runTest } from '../../test.ts';

test('Regrouper les options allemand, anglais et espagnol (45 élèves)', async () => {
  return await runTest(
    'users-45.json',
    'input-45-gather-languages.json',
    [
      {
        "properties.allemand": {
          count: 10,
        },
        "properties.anglais": {
          count: 5,
        },
      },
      {
        "properties.espagnol": {
          count: 15,
        },
      },
      {
        "properties.anglais": {
          count: 15,
        },
      },
    ],
    ['properties.allemand', 'properties.anglais', 'properties.espagnol'],
  );
});
