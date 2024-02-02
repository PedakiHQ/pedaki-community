import { test } from 'vitest';
import { runTest } from '../../test.ts';

test('Regrouper les options allemand, anglais et espagnol dans 2 classes (45 élèves)', async () => {
  return await runTest(
    'users-45.json',
    'input-45-gather-langages-two-classes.json',
    [
      {},
      {
        anglais: {
          count: 20,
        },
      },
    ],
    ['allemand', 'anglais', 'espagnol'],
  );
});
