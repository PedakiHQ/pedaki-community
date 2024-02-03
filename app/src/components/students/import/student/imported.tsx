import { fields } from '~/components/students/import/student/constants.ts';
import BaseForm from '~/components/students/import/student/form.tsx';
import type { OutputType } from '~api/router/router.ts';
import React from 'react';

type PossibleStudentData =
  OutputType['students']['imports']['students']['getOne']['import'];

interface ImportedProps {
  baseData: PossibleStudentData;
}

const Imported = ({ baseData }: ImportedProps) => {
  return (
    <>
      <div>
        <h3 className="text-label-sm text-soft">Donnée importée</h3>
        <p>&nbsp;</p>
      </div>

      <BaseForm data={baseData} disabled fields={fields}
      key={`${baseData?.id}`}
                tKey="students.import.fields" />
    </>
  );
};

export default Imported;
