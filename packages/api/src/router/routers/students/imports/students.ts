import {prisma} from '@pedaki/db';
import {
    MergeGetManyInput,
    MergeGetManyStudentsOutput,
    MergeGetOneClassOutput,
    MergeGetOneInput, MergeGetOneStudentOutput,
} from '@pedaki/services/students/imports/merge/merge.model';
import {privateProcedure, router} from '~api/router/trpc.ts';
import {z} from 'zod';

export const studentImportsStudents = router({
    getMany: privateProcedure
        .input(MergeGetManyInput)
        .output(MergeGetManyStudentsOutput)
        .query(async ({input}) => {
            return await prisma.importStudent.findMany({
                where: {
                    importId: input.importId,
                },
                select: {
                    id: true,
                    status: true,
                    firstName: true,
                    lastName: true,
                    otherName: true,
                },
            });
        }),

    getOne: privateProcedure
        .input(MergeGetOneInput)
        .output(MergeGetOneStudentOutput)
        .query(async ({input}) => {
            const data = await prisma.importStudent.findUniqueOrThrow({
                where: {
                    id: input.id,
                    importId: input.importId,
                },
                select: {
                    id: true,
                    status: true,
                    firstName: true,
                    lastName: true,
                    otherName: true,
                    student: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            otherName: true,
                        },
                    },
                },
            });


            const importData = {
                firstName: data.firstName,
                lastName: data.lastName,
                otherName: data.otherName,
            };

            return {
                status: data.status,
                import: importData,
                current: data.student,
            };
        }),

    getPossibleClassData: privateProcedure
        .input(
            z.object({
                classId: z.number(),
            }),
        )
        .output(MergeGetOneClassOutput.pick({current: true}))
        .query(async ({input}) => {
            const data = await prisma.class.findUniqueOrThrow({
                where: {
                    id: input.classId,
                },
                select: {
                    id: true,
                    name: true,
                    levelId: true,
                    academicYearId: true,
                    mainTeacherId: true,
                },
            });

            return {
                current: data,
            };
        }),
});
