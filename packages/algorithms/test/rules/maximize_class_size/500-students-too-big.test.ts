import { test } from 'vitest';
import { runTest } from '../../test.ts';

test('Maximiser la taille des classes, avec des classes trop grandes (500 élèves)', async () => {
  return await runTest('users-500.json', 'input-500-maximize-class-size-too-big.json', [
    {
      total: [500],
    },
  ]);
});
