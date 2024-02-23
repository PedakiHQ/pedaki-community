import {
  getAnonymousSession,
  getInternalSession,
  getUserSession,
} from '~api/tests/helpers/sessions.ts';
import {describe, expect, test} from 'vitest';
import {assertIsAuthenticated} from "@pedaki/tests/middleware";

describe('classGeneratorRouter', () => {
  const anonymousSession = getAnonymousSession();
  const userSession = getUserSession();
  const internalSession = getInternalSession();

  describe('create', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(() => api.classes.generator.create({rules: [], constraints: {class_amount_limit: 100, class_size_limit: 30}}), {
          shouldWork: type !== 'anonymousUserSession',
        });
      },
    );
    test.each([userSession, internalSession])('returns something', async ({ api }) => {
      const output = await api.classes.generator.create({rules: [], constraints: {class_amount_limit: 100, class_size_limit: 30}});
      expect(Object.keys(output)).toMatchObject({});
    });
    test.each([userSession, internalSession])('maximizes classes', async ({api}) => {
      const output = await api.classes.generator.create({rules: [{rule: "maximize_classes", priority: 1}], constraints: {class_amount_limit: 100, class_size_limit: 30}});
      expect(output.classes.length).toBe(100)
      expect(output.rules[0].respect_percent).toBe(1)
    })
  });
});
