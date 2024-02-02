// @ts-nocheck
import { test } from 'vitest';
import { runTest } from '../../test.ts';

test('Maximiser le nombre de classes (500 élèves)', async () => {
  return await runTest('users-500.json', 'input-500-maximize-classes.json', [
    {
      total: [1, 100],
    },
    {
      total: [1, 100],
    },
    {
      total: [1, 100],
    },
    {
      total: [1, 100],
    },
    {
      total: [1, 100],
    },
    {
      total: [1, 100],
    },
    {
      total: [1, 100],
    },
    {
      total: [1, 100],
    },
    {
      total: [1, 100],
    },
    {
      total: [1, 100],
    },
  ]);
});
