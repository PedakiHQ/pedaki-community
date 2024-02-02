import { test } from 'vitest';
import { runTest } from '../../test.ts';

test("Maximiser le nombre d'élèves par classe (500 élèves)", async () => {
  return await runTest('users-500.json', 'input-500-maximize-class-size.json', [
    {
      total: 100,
    },
    {
      total: 100,
    },
    {
      total: 100,
    },
    {
      total: 100,
    },
    {
      total: 100,
    },
  ]);
});
