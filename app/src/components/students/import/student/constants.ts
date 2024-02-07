export type BaseFields =
  | {
      type: 'text' | 'date' | 'select' | 'number';
      options?: never;
      min?: never;
      max?: never;
      placeholder?: string;
    }
  | {
      type: 'select';
      placeholder?: string;
      options: string[];
    }
  | {
      type: 'number';
      min?: number;
      placeholder?: string;
      max?: number;
    };

export const fields = {
  firstName: {
    type: 'text',
  },
  lastName: {
    type: 'text',
  },
  otherName: {
    type: 'text',
  },
  birthDate: {
    type: 'date',
  },
  gender: {
    type: 'select',
    options: ['M', 'F', 'O'],
  },
} as const satisfies Record<string, BaseFields>;

// Duplicate of PROPERTIES_VALIDATION in services package

export const propertiesFields = {
  LEVEL: {
    type: 'number',
    min: 0,
    max: 100,
    placeholder: '0-100',
  },
} as const satisfies Readonly<Record<string, BaseFields>>;
