import { test } from 'vitest';
import { runTest } from '../../test.ts';

test("Regrouper et équilibrer l'option allemand (500 élèves)", async () => {
  return await runTest(
    'users-500.json',
    'input-500-balance-gather-deutsch.json',
    [
      {
        allemand: {
          count: [98, 99],
        },
      },
      {
        allemand: {
          count: [98, 99],
        },
      },
      {},
      {},
      {},
    ],
    ['allemand'],
  );
});
