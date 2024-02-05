'use client';

import { Button } from '@pedaki/design/ui/button';
import { IconSpinner, IconX } from '@pedaki/design/ui/icons';
import { Sheet, SheetContent, SheetTrigger } from '@pedaki/design/ui/sheet';
import { cn } from '@pedaki/design/utils';
import type { MergeUpdateOneStudentInput } from '@pedaki/services/students/imports/merge/merge.model.js';
import { StudentSchema } from '@pedaki/services/students/student_base.model';
import { serialize, useVisibleParams } from '~/components/students/import/parameters.ts';
import { fields } from '~/components/students/import/student/constants.ts';
import BaseForm from '~/components/students/import/student/form.tsx';
import Client from '~/components/students/list/client.tsx';
import type { StudentData } from '~/components/students/list/columns.tsx';
import { useScopedI18n } from '~/locales/client.ts';
import { api } from '~/server/clients/client.ts';
import { useStudentsImportStore } from '~/store/students/import/import.store.ts';
import type { OutputType } from '~api/router/router.ts';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

// TODO: there is an issue here, when updating a student, the form is not updated on the first refresh

type PossibleStudentData = OutputType['students']['imports']['students']['getPossibleStudentData'];

interface ExistingProps {
  baseData: OutputType['students']['imports']['students']['getOne']['current'];
  importedData: OutputType['students']['imports']['students']['getOne']['import'];
  importId: string;
  status: string;
}

const Existing = ({ baseData, importedData, importId }: ExistingProps) => {
  const [visible] = useVisibleParams();
  const items = useStudentsImportStore(state => state.items);
  const setItems = useStudentsImportStore(state => state.setItems);

  const hasChangedPossibleStudent = React.useRef(false);
  const [possibleStudent, _setPossibleStudent] = React.useState<PossibleStudentData | null>(
    baseData,
  );

  console.log({
    baseData,
    importedData,
    possibleStudent,
  });

  const setPossibleStudent = (data: PossibleStudentData | null) => {
    hasChangedPossibleStudent.current = true;
    _setPossibleStudent(data);
  };

  const router = useRouter();

  const updateStudentImportMutation = api.students.imports.students.updateOne.useMutation({
    onSuccess: async (_, variables: MergeUpdateOneStudentInput) => {
      const nextId = items
        .filter(item => item?.status === 'PENDING')
        .find(item => item.id != importedData.id);

      const newItems = items.map(item => {
        if (item.id === variables.id) {
          return {
            ...item,
            firstName: variables.data?.current?.firstName ?? item.firstName,
            lastName: variables.data?.current?.lastName ?? item.lastName,
            status: variables.status,
            id: item.id,
          };
        }
        return item;
      });

      setItems(newItems);
      if (variables.status === 'DONE') {
        await utils.students.imports.students.getOne.invalidate({
          importId,
          id: importedData.id,
        });
      }
      router.push(serialize({ id: nextId?.id ?? importedData.id, visible }));
    },
    onError: e => {
      // TODO: translate
      toast.error('Une erreur est survenue', {
        id: 'import-error',
      });
    },
  });

  const loading = updateStudentImportMutation.isLoading;
  const utils = api.useUtils();

  const deleteImport = () => {
    updateStudentImportMutation.mutate({
      importId: importId,
      id: importedData.id,
      status: 'REMOVED',
    });
  };

  const updateImport = (data: PossibleStudentData) => {
    updateStudentImportMutation.mutate({
      importId: importId,
      id: importedData.id,
      status: 'DONE',
      data: { current: data, studentId: possibleStudent?.id ?? null },
    });
  };

  return (
    <>
      <div>
        <h3 className="text-label-sm text-soft">Résultat final</h3>
        <SelectAnotherBaseStudent
          setPossibleStudent={setPossibleStudent}
          possibleStudent={possibleStudent}
        />
      </div>
      <BaseForm
        data={hasChangedPossibleStudent.current ? possibleStudent ?? importedData : importedData}
        importedData={importedData}
        fields={fields}
        tKey="students.import.fields"
        key={Math.random()}
        schema={StudentSchema}
        onSubmitted={updateImport}
      >
        {() => {
          return (
            <>
              <div className="flex items-center justify-end">
                <div className={cn('pr-2', !loading && 'hidden')}>
                  <IconSpinner className="h-5 w-5 animate-spin text-primary-base" />
                </div>
                <Button
                  type="button"
                  disabled={loading}
                  onClick={deleteImport}
                  className="rounded-r-none"
                  size="sm"
                  variant="stroke-primary-main"
                >
                  Supprimer
                </Button>
                <Button className="rounded-l-none" size="sm" variant="stroke-primary-main">
                  {possibleStudent !== null ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </div>
            </>
          );
        }}
      </BaseForm>
    </>
  );
};

const SelectAnotherBaseStudent = ({
  setPossibleStudent,
  possibleStudent,
}: {
  setPossibleStudent: (data: PossibleStudentData | null) => void;
  possibleStudent: PossibleStudentData | null;
}) => {
  const [open, setOpen] = React.useState(false);
  const t = useScopedI18n('students.import.existing');
  const utils = api.useUtils();

  const onClickRow = async (event: React.MouseEvent<HTMLTableRowElement>, row: StudentData) => {
    await utils.students.imports.students.getPossibleStudentData
      .fetch({ studentId: row.id })
      .then(data => {
        setPossibleStudent(data);
        setOpen(false);
      });
  };

  const isLinked = possibleStudent !== null;

  return (
    <div className="flex">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="text-label-sm text-sub hover:underline">
          {!isLinked
            ? t('linkToStudent')
            : t(
                'linkedToStudent',
                // @ts-expect-error: issue with the translation params type
                {
                  name: possibleStudent.firstName + ' ' + possibleStudent.lastName,
                },
              )}
        </SheetTrigger>
        <SheetContent
          side="right"
          className="md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <div className="h-full p-4">
            <Client
              onClickRow={onClickRow}
              selectedRows={isLinked ? { [possibleStudent.id - 1]: true } : {}}
            />
          </div>
        </SheetContent>
      </Sheet>
      <Button
        size="icon"
        variant="ghost-sub"
        className={cn('ml-2 h-6 w-6', !isLinked && 'invisible')}
        onClick={() => setPossibleStudent(null)}
      >
        <IconX className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Existing;
