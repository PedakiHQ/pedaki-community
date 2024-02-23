import {GenerateClassesAlgorithm, OutputSchema } from '@pedaki/algorithms';
import type {Output, RawRule, RawStudent} from '@pedaki/algorithms';
import { prisma } from '@pedaki/db';
import { ClassGeneratorInputWithRefinementSchema } from '@pedaki/services/classes/generator.model.js';
import { studentQueryService } from '@pedaki/services/students/query.service.js';
import { privateProcedure, router } from '~api/router/trpc.ts';
import type {Field} from "@pedaki/services/students/query.model.client";

export const classGeneratorRouter = router({
  create: privateProcedure
    .input(ClassGeneratorInputWithRefinementSchema)
    .output(OutputSchema)
    .mutation(async ({ input }): Promise<Output> => {
      // Get all fields from input
      // TODO faire mieux ?
      const options: Field[] = []
      const extras: Field[] = []
      for (const rule of (input.rules as RawRule[])) {
        if (!rule.attributes) continue
        for (const attribute of rule.attributes) {
          if (attribute.options) {
            for (const option of attribute.options) {
              // todo vérifier le field
              if (!options.includes(option.option as Field)) options.push(option.option as Field)
            }
          }

          if (attribute.extras) {
            for (const extra of attribute.extras) {
              if (!extras.includes(extra as Field)) extras.push(extra as Field)
            }
          }
        }
      }

      const queryData = studentQueryService.buildSelectPreparedQuery(
        {
          where: input.where,
          fields: ['id', 'gender', ...options, ...extras],
          pagination: {
            page: 1,
            limit: 99999999, // Skip pagination todo erreur avec -1
          },
        },
        {
          selectFields: ['id'],
        },
      );

      const data =
        await prisma.$queryRawUnsafe<
          { id: number; gender: string; birthDate: string; [key: string]: any }[]
        >(queryData);

      // TODO: transform data to match algorithm input

      const fieldsFromArray = (student: object, array: Field[]) => {
        return Object.fromEntries(Object.entries(student).filter(([k]) => array.includes(k as Field)))
      }

      const students: RawStudent[] = data.map(student => {
        return {
          id: student.id.toString(),
          birthdate: new Date(student.birthDate),
          gender: student.gender,
          levels: fieldsFromArray(student, options),
          extra: fieldsFromArray(student, extras),
          // TODO relationships
        };
      });

      const algo = new GenerateClassesAlgorithm(students, {
        constraints: input.constraints,
        rules: input.rules,
      });

      return algo.solve();
    }),
});
