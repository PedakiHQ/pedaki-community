import { test } from 'vitest';
import { runTest } from '../../test.ts';

test("Regrouper et équilibrer le niveau de l'option allemand dans chaque classe (500 élèves)", async () => {
  return await runTest(
    'users-500.json',
    'input-500-balance-deutsch-class-level.json',
    ['allemand'],
    [
      {
        allemand: {
          count: [97, 100],
        },
      },
      {
        allemand: {
          count: [97, 100],
          levels: {
            0: [16, 17],
            1: [16, 17],
            2: [16, 17],
            3: [16, 17],
            4: [16, 17],
            5: [16, 17],
          },
        },
      },
      {},
      {},
      {},
    ],
  );
});
