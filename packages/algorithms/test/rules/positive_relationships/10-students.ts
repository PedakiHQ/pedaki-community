import { test } from 'vitest';
import { runTest } from '../../test.ts';

test('Respecter les relations positives (10 élèves)', async () => {
  return await runTest('users-10.json', 'input-10-positive-relationships.json', [
    // @ts-ignore
    {
      total: 5,
      ids: [
        [1, 5, 6, 4, 8],
        [1, 5, 6, 7, 3],
      ],
    },
    // @ts-ignore
    {
      total: 5,
      ids: [
        [2, 9, 3, 7, 10],
        [2, 9, 4, 8, 10],
      ],
    },
  ]);
});
