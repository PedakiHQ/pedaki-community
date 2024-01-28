export const description =
  'Regrouper les options allemand, anglais et espagnol, et équilibrer le dénombrement des genres dans chaque classe (45 élèves)';
export const studentsFile = './data/users-45.json';
export const inputFile = './data/input-45-gather-langages-balance-gender-class-level.json';
export const keysMask = ['allemand', 'anglais', 'espagnol', 'M', 'F'];
export const output = [
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
];
