import { test } from 'vitest';
import { runTest } from '../../test.ts';

test('Regrouper les options allemand, anglais et espagnol, et équilibrer le dénombrement des genres dans chaque classe (45 élèves)', async () => {
  return await runTest(
    'users-45.json',
    'input-45-gather-langages-balance-gender-class-level.json',
    ['allemand', 'anglais', 'espagnol', 'M', 'F'],
    [
      {
        allemand: {
          count: 10,
        },
        anglais: {
          count: 5,
        },
        M: {
          count: [7, 8],
        },
      },
      {
        espagnol: {
          count: 15,
        },
      },
      {
        anglais: {
          count: 15,
        },
      },
    ],
  );
});
