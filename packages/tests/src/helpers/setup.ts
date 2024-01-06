import { beforeAll, beforeEach } from 'vitest';
import resetDb from './reset-db.ts';

beforeAll(async () => {
  await resetDb();
});

beforeEach(async () => {
  await resetDb();
});
