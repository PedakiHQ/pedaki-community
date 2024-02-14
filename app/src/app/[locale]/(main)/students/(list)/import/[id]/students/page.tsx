import type { PageType } from '~/app/types.ts';
import ImportDataSelection from '~/components/students/import/ImportDataSelection.tsx';
import StudentDiff from '~/components/students/import/student/StudentDiff.tsx';
import StudentsListWrapper from '~/components/students/list/wrapper.tsx';
import TutorialTrigger from '~/components/tutorial-trigger.tsx';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { api } from '~/server/clients/internal.ts';
import StoreProvider from '~/store/students/import/StoreProvider.tsx';
import { TUTORIAL_ID } from '~/store/tutorial/data/upload-students/constants.ts';
import React from 'react';

export default async function StudentsImportStudentsPage({ params }: PageType<{ id: string }>) {
  setStaticParamsLocale(params.locale);

  // TODO: move mapping query in layout
  const [classMapping, levelMapping, items] = await Promise.all([
    api.classes.getMany.query(),
    api.classes.levels.getMany.query(),
    api.students.imports.students.getMany.query({ importId: params.id }),
  ]);

  return (
    <div className="flex h-full flex-col gap-4 @4xl/main:flex-row">
      <TutorialTrigger id={TUTORIAL_ID} step={4} />

      <StoreProvider
        classMapping={classMapping}
        levelMapping={levelMapping}
        importId={params.id}
        items={items}
      >
        <ImportDataSelection type="students" />
        <StudentsListWrapper>
          <StudentDiff importId={params.id} />
        </StudentsListWrapper>
      </StoreProvider>
    </div>
  );
}
