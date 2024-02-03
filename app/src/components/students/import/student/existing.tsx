import { Button } from '@pedaki/design/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@pedaki/design/ui/form';
import { IconX } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@pedaki/design/ui/sheet';
import { cn } from '@pedaki/design/utils';
import { fields } from '~/components/students/import/student/constants.ts';
import BaseForm from '~/components/students/import/student/form.tsx';
import Client from '~/components/students/list/client.tsx';
import type { StudentData } from '~/components/students/list/columns.tsx';
import { useScopedI18n } from '~/locales/client.ts';
import { api } from '~/server/clients/client.ts';
import type { OutputType } from '~api/router/router.ts';
import React, {useEffect, useState} from 'react';

type PossibleStudentData =
  OutputType['students']['imports']['students']['getPossibleStudentData']['current'];

interface ExistingProps {
  baseData: PossibleStudentData | null;
  importedData: PossibleStudentData | null;
}

const merge = (prev: PossibleStudentData, next: PossibleStudentData | null):(PossibleStudentData | null) => {
    if(!prev) return next;
    return {
        ...next,
        ...prev,
        id: next?.id ?? prev.id,
    }
}

const Existing = ({ baseData, importedData }: ExistingProps) => {
  const [linkStudentId, setLinkStudentId] = React.useState<number | null>(null);

  const { data: linkedStudent } = api.students.imports.students.getPossibleStudentData.useQuery(
    {
      studentId: linkStudentId!,
    },
    {
      enabled: linkStudentId !== null,
    },
  );

  const [finalData, setFinalData] = useState<PossibleStudentData | null>(baseData);

    useEffect(() => {
        setFinalData(linkedStudent?.current ?? baseData);
    }, [linkedStudent]);

    useEffect(() => {
        setFinalData(baseData);
    }, [baseData]);

  return (
    <>
      <div>
        <h3 className="text-label-sm text-soft">Résultat final</h3>
        <SelectAnotherBaseStudent
          setLinkStudentId={setLinkStudentId}
          linkedStudent={linkedStudent?.current ?? null}
        />
      </div>
      <BaseForm
        data={finalData}
        importedData={importedData}
        fields={fields}
        key={`${baseData?.id}-${linkStudentId}-${finalData?.id}`}
        tKey="students.import.fields"
      >
        {form => {
          return (
            <>
              <pre>
                {JSON.stringify(form.watch(), null, 2)}
              </pre>
            </>
          );
        }}
      </BaseForm>
    </>
  );
};

const SelectAnotherBaseStudent = ({
  setLinkStudentId,
  linkedStudent,
}: {
  setLinkStudentId: (id: number | null) => void;
  linkedStudent: PossibleStudentData | null;
}) => {
  const [open, setOpen] = React.useState(false);
  const t = useScopedI18n('students.import.existing');

  const onClickRow = (row: StudentData) => {
    setLinkStudentId(row.id);
    setOpen(false);
  };

  const isLinked = linkedStudent !== null;

  return (
    <div className="flex">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="text-label-sm text-sub hover:underline">
          {!isLinked
            ? t('linkToStudent')
            : t('linkedToStudent', {
                name: linkedStudent.firstName + ' ' + linkedStudent.lastName,
              })}
        </SheetTrigger>
        <SheetContent
          side="right"
          className="md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <div className="h-full p-4">
            <Client onClickRow={onClickRow} />
          </div>
        </SheetContent>
      </Sheet>
      <Button
        size="icon"
        variant="ghost-sub"
        className={cn('ml-2 h-6 w-6', !isLinked && 'invisible')}
        onClick={() => setLinkStudentId(null)}
      >
        <IconX className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Existing;
