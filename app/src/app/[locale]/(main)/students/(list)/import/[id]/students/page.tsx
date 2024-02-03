import StudentDiff from '~/app/[locale]/(main)/students/(list)/import/[id]/students/StudentDiff.tsx';
import type { PageType } from '~/app/types.ts';
import ImportDataSelection from '~/components/students/import/ImportDataSelection.tsx';
import StudentsListWrapper from '~/components/students/list/wrapper.tsx';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { api } from '~/server/clients/internal.ts';
import React from 'react';

export default async function StudentsImportStudentsPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.import');
  const newStudents = await api.students.imports.students.getMany.query(
    { importId: params.id },
    {
      context: {
        revalidate: false,
      },
    },
  );

  return (
    <div className="flex h-full flex-col gap-4 @4xl/main:flex-row">
      <ImportDataSelection
        items={newStudents.map(student => ({
          ...student,
          label: student.firstName + ' ' + student.lastName,
        }))}
        type="students"
      />
      <StudentsListWrapper>
        <StudentDiff importId={params.id} />
      </StudentsListWrapper>
    </div>
  );
}
