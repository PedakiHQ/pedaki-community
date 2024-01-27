import {
  createParser,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsNumberLiteral,
} from 'nuqs/parsers';

const sortingParser = createParser({
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

export const possiblesPerPage = [10, 20, 30] as const;
export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral(possiblesPerPage).withDefault(10),
  sorting: parseAsArrayOf(sortingParser).withDefault([]),
  columns: parseAsJson<Record<string, boolean>>().withDefault({
    firstName: true,
    lastName: true,
    'class.name': true,
  }),
} as const;
export const serialize = createSerializer(searchParams);
export type PossiblePerPage = (typeof possiblesPerPage)[number];
