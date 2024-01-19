// Error map adapted from: https://github.com/aiji42/zod-i18n/blob/main/packages/core/src/index.ts
/*
MIT License
Copyright (c) 2021 AijiUejima
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
Footer
*/
import type { GetScopedI18nKeys, GetScopedI18nType } from '~/locales/server';
import type { z } from 'zod';
import { ZodIssueCode, ZodParsedType } from 'zod';

let errorMap: z.ZodErrorMap | undefined;

export const getZodErrorMap = (t: GetScopedI18nType<'zod'>) => {
  if (!errorMap) {
    errorMap = generateZodErrorMap(t);
  }

  return errorMap;
};

export const ZOD_ERROR_PREFIX = 'ZOD_';
export const customErrorParams = (
  key: GetScopedI18nKeys<'zod.custom'>,
  // TODO: get the right type for params ? will be able to remove the ts-expect-error in the custom case
  params: Record<string, any> | undefined = undefined,
) => ({
  key,
  params,
});

const generateZodErrorMap =
  (t: GetScopedI18nType<'zod'>): z.ZodErrorMap =>
  (issue, ctx) => {
    let message: string = ctx.defaultError;
    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        if (issue.received === ZodParsedType.undefined) {
          message = t('errors.invalid_type_received_undefined');
        } else {
          message = t('errors.invalid_type', {
            expected: t(`types.${issue.expected}`),
            received: t(`types.${issue.received}`),
          });
        }
        break;
      case ZodIssueCode.invalid_literal:
        message = t('errors.invalid_literal', {
          expected: JSON.stringify(issue.expected),
        });
        break;
      case ZodIssueCode.unrecognized_keys:
        message = t('errors.unrecognized_keys', {
          keys: issue.keys.join(', '),
        });
        break;
      case ZodIssueCode.invalid_union:
        message = t('errors.invalid_union');
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = t('errors.invalid_union_discriminator', {
          options: issue.options.join(', '),
        });
        break;
      case ZodIssueCode.invalid_enum_value:
        message = t('errors.invalid_enum_value', {
          options: issue.options.join(', '),
          received: issue.received,
        });
        break;
      case ZodIssueCode.invalid_arguments:
        message = t('errors.invalid_arguments');
        break;
      case ZodIssueCode.invalid_return_type:
        message = t('errors.invalid_return_type');
        break;
      case ZodIssueCode.invalid_date:
        message = t('errors.invalid_date');
        break;
      case ZodIssueCode.invalid_string:
        if (typeof issue.validation === 'object') {
          if ('startsWith' in issue.validation) {
            message = t(`errors.invalid_string.startsWith`, {
              startsWith: issue.validation.startsWith,
            });
          } else if ('endsWith' in issue.validation) {
            message = t(`errors.invalid_string.endsWith`, {
              endsWith: issue.validation.endsWith,
            });
          }
        } else {
          message = t(`errors.invalid_string.${issue.validation}`, {
            validation: t(`validations.${issue.validation}`),
          });
        }
        break;
      case ZodIssueCode.too_small:
        message = t(
          `errors.too_small.${issue.type}.${
            issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'
          }`,
          {
            minimum: issue.minimum.toString(),
          },
        );
        break;
      case ZodIssueCode.too_big:
        message = t(
          `errors.too_big.${issue.type}.${
            issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'
          }`,
          {
            maximum: issue.maximum.toString(),
          },
        );
        break;
      case ZodIssueCode.custom:
        console.log(issue.params);

        if (issue.params?.key) {
           
          const params = issue.params as ReturnType<typeof customErrorParams>;
          // @ts-expect-error As long as the key is valid, it will be translated
          message = t(`custom.${params.key}`, params.params);
        } else {
          message = t('errors.custom');
        }
        break;
      case ZodIssueCode.invalid_intersection_types:
        message = t('errors.invalid_intersection_types');
        break;
      case ZodIssueCode.not_multiple_of:
        message = t('errors.not_multiple_of', {
          multipleOf: issue.multipleOf.toString(),
        });
        break;
      case ZodIssueCode.not_finite:
        message = t('errors.not_finite');
        break;
      default:
    }

    return { message };
  };
