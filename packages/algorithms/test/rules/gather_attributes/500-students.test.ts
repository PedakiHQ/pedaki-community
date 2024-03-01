import { test } from 'vitest';
import { runTest } from '../../test.ts';

test("Regrouper l'option allemand (500 élèves)", async () => {
  return await runTest(
    'users-500.json',
    'input-500-gather-deutsch.json',
    [
      {
        "properties.allemand": {
          count: [97, 100],
        },
      },
      {
        "properties.allemand": {
          count: [97, 100],
        },
      },
      {},
      {},
      {},
    ],
    ['properties.allemand'],
  );
});
