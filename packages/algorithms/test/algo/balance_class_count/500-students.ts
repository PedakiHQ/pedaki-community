export const description =
  "Regrouper et équilibrer le niveau de l'option allemand dans chaque classe (500 élèves)";
export const studentsFile = './data/users-500.json';
export const inputFile = './data/input-500-balance-deutsch-class-level.json';
export const keysMask = ['allemand'];
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
  },
  {},
  {},
  {},
];
