import { test } from 'vitest';
import { runTest } from '../../test.ts';

export const description =
  "Regrouper et équilibrer le niveau de l'option allemand dans chaque classe, et équilibrer le dénombrement des genres dans chaque classe (500 élèves)";
export const studentsFile = './data/users-500.json';
export const inputFile = './data/input-500-balance-deutsch-and-gender-class-level.json';
export const keysMask = ['allemand', 'M', 'F'];
export const showLevel = true;
export const output = [
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
    M: { count: 50 },
    F: { count: 50 },
  },
  { M: { count: [49, 51] }, F: { count: [49, 51] } },
  { M: { count: 50 }, F: { count: 50 } },
  { M: { count: 50 }, F: { count: 50 } },
];

test("Regrouper et équilibrer le niveau de l'option allemand dans chaque classe, et équilibrer le dénombrement des genres dans chaque classe (500 élèves)", async () => {
  return await runTest(
    'users-500.json',
    'input-500-balance-deutsch-and-gender-class-level.json',
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
        M: { count: 50 },
        F: { count: 50 },
      },
      { M: { count: [49, 51] }, F: { count: [49, 51] } },
      { M: { count: 50 }, F: { count: 50 } },
      { M: { count: 50 }, F: { count: 50 } },
    ],
    ['allemand', 'M', 'F'],
  );
});
