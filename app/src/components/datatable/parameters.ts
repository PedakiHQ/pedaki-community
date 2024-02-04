import { createParser } from 'nuqs/parsers';

export const sortingParser = createParser({
  parse: (value: string) => {
    const [column, direction] = value.split(':', 2);
    if (direction !== 'asc' && direction !== 'desc') {
      return null;
    }
    return {
      id: column!,
      desc: direction === 'desc',
    };
  },
  serialize: (value: { id: string; desc: boolean }) => {
    return `${value.id}:${value.desc ? 'desc' : 'asc'}`;
  },
});

export const possiblesPerPage = [10, 25, 50, 100] as const;
export type PossiblePerPage = (typeof possiblesPerPage)[number];
