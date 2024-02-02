import { test } from 'vitest';
import { runTest } from '../../test.ts';

test("Maximiser le nombre de classe et équilibrer le nombre d'élèves par classe (500 élèves)", async () => {
  return await runTest('users-500.json', 'input-500-maximize-classes-balance.json', [
    {
      total: 50,
    },
    {
      total: 50,
    },
    {
      total: 50,
    },
    {
      total: 50,
    },
    {
      total: 50,
    },
    {
      total: 50,
    },
    {
      total: 50,
    },
    {
      total: 50,
    },
    {
      total: 50,
    },
    {
      total: 50,
    },
  ]);
});
