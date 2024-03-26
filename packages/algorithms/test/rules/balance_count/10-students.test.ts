import { test } from 'vitest';
import { runTest } from '../../test.ts';

test("Equilibrer l'option allemand (10 élèves)", async () => {
  return await runTest(
    'users-10.json',
    'input-10-balance-deutsch.json',
    [
      {
        "properties.allemand": {
          count: [2, 3],
        },
      },
      {
        "properties.allemand": {
          count: [2, 3],
        },
      },
    ],
    ['properties.allemand'],
  );
});
