import { test } from 'vitest';
import { runTest } from '../../test.ts';

test("Regrouper et équilibrer le niveau de l'option allemand entre les classes (500 élèves)", async () => {
  return await runTest(
    'users-500.json',
    'input-500-balance-deutsch-level.json',
    [
      {
        allemand: {
          count: [97, 100],
          levels: {
            0: [13, 14],
            1: 18,
            2: 17,
            3: 17,
            4: [14, 15],
            5: [18, 19],
          },
        },
      },
      {
        allemand: {
          count: [97, 100],
          levels: {
            0: [13, 14],
            1: 18,
            2: 17,
            3: 17,
            4: [14, 15],
            5: [18, 19],
          },
        },
      },
      {},
      {},
      {},
    ],
    ['allemand'],
    undefined,
    true,
  );
});
