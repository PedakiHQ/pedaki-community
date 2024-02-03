import ClassDiff from '~/app/[locale]/(main)/students/(list)/import/[id]/(classes)/ClassDiff.tsx';
import type { PageType } from '~/app/types.ts';
import ImportDataSelection from '~/components/students/import/ImportDataSelection.tsx';
import StudentsListWrapper from '~/components/students/list/wrapper.tsx';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { api } from '~/server/clients/internal.ts';
import React from 'react';

export default async function StudentsImportClassesPage({ params }: PageType<{ id: string }>) {
  setStaticParamsLocale(params.locale);
  const newClasses = await api.students.imports.classes.getMany.query(
    { importId: params.id },
    {
      context: {
        revalidate: false,
      },
    },
  );

  return (
    <div className="flex h-full flex-col gap-4 @4xl/main:flex-row">
      <ImportDataSelection items={newClasses.map(c => ({ ...c, label: c.name }))} type="classes" />
      <StudentsListWrapper>
        <ClassDiff importId={params.id} />
      </StudentsListWrapper>
    </div>
  );
}
