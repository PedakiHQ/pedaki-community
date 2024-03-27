import input from './input.ts';

export default {
  metadata: {
    title: 'Générer les classes',
  },
  header: {
    title: 'Classes',
    description: 'Générer les classes',
  },
  input: input,
  output: {
    generate: {
      label: 'Générer les classes',
    },
  },
} as const;
