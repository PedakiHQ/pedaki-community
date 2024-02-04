import { fields } from '~/components/students/import/student/constants.ts';
import BaseForm from '~/components/students/import/student/form.tsx';
import { useScopedI18n } from '~/locales/client.ts';
import type { OutputType } from '~api/router/router.ts';
import React from 'react';

type PossibleStudentData = OutputType['students']['imports']['students']['getOne']['import'];

interface ImportedProps {
  baseData: PossibleStudentData;
  status: string;
}

const Imported = ({ baseData, status }: ImportedProps) => {
  const t = useScopedI18n('students.import.imported');

  return (
    <>
      <div>
        <h3 className="text-label-sm text-soft">
          Donnée importée{' '}
          <span className="text-label-xs">{status === 'DONE' ? t(`status.${status}`) : ''}</span>
        </h3>
        <p>&nbsp;</p>
      </div>

      <BaseForm
        data={baseData}
        disabled
        fields={fields}
        key={`${baseData?.id}`}
        tKey="students.import.fields"
      />
    </>
  );
};

export default Imported;
