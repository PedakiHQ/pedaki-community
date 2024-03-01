import { test } from 'vitest';
import { runTest } from '../../test.ts';

test('Regrouper les options allemand, anglais et espagnol, et équilibrer le dénombrement des genres dans chaque classe (45 élèves)', async () => {
  return await runTest(
    'users-45.json',
    'input-45-gather-langages-balance-gender-class-level.json',
    [
      {
        "properties.allemand": {
          count: 10,
        },
        "properties.anglais": {
          count: 5,
        },
        M: {
          count: [7, 8],
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
    ['properties.allemand', 'properties.anglais', 'properties.espagnol', 'M', 'F'],
  );
});
