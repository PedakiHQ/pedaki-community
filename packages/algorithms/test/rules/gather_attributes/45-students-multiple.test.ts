import { test } from 'vitest';
import { runTest } from '../../test.ts';

test('Regrouper les options allemand et espagnol ensemble (45 élèves)', async () => {
  return await runTest(
    'users-45.json',
    'input-45-gather-deutsch-spanish-together.json',
    [
      {
        "properties.allemand": {
          count: 10,
        },
        "properties.espagnol": {
          count: 15,
        },
      },
      {
        "properties.anglais": {
          count: 20,
        },
      },
    ],
    ['properties.allemand', 'properties.anglais', 'properties.espagnol'],
  );
});
