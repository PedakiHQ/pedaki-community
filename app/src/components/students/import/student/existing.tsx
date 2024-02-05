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
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type PossibleStudentData = OutputType['students']['imports']['students']['getOne']['current'];

// TODO: there is an issue here, when updating a student, the form is not updated on the first refresh

interface ExistingProps {
  baseData: OutputType['students']['imports']['students']['getOne']['current'];
  importedData: OutputType['students']['imports']['students']['getOne']['import'];
  importId: string;
  status: string;
}

const Existing = ({ baseData, importedData, importId, status }: ExistingProps) => {
  const [visible] = useVisibleParams();
  const items = useStudentsImportStore(state => state.items);
  const setItems = useStudentsImportStore(state => state.setItems);

  const [linkStudentId, setLinkStudentId] = React.useState<number | null>(baseData?.id ?? null);

  const { data: linkedStudent } = api.students.imports.students.getPossibleStudentData.useQuery(
    {
      studentId: linkStudentId!,
    },
    {
      enabled: linkStudentId !== null && baseData?.id !== linkStudentId,
      initialData: baseData!,
    },
  );

  const [formBaseData, setFormBaseData] = useState<PossibleStudentData | null>(
    status === 'DONE' ? importedData : baseData ?? importedData,
  );

  useEffect(() => {
    if (linkedStudent) {
      if (status !== 'DONE' && linkedStudent.id !== baseData?.id) {
        setFormBaseData(linkedStudent);
      }
    }
  }, [linkedStudent, status, baseData]);

  const router = useRouter();
  const utils = api.useContext();

  const updateStudentImportMutation = api.students.imports.students.updateOne.useMutation({
    onSuccess: async (_, variables: MergeUpdateOneStudentInput) => {
      const nextId = items
        .filter(item => item?.status === 'PENDING')
        .find(item => item.id != importedData.id);

      const newItems = items.map(item => {
        if (item.id === variables.id) {
          return {
            ...item,
            ...variables.data?.current,
            status: variables.status,
            id: item.id,
          };
        }
        return item;
      });

      setItems(newItems);
      if (linkStudentId) {
        await utils.students.imports.students.getPossibleStudentData.invalidate({
          studentId: linkStudentId,
        });
      }
      if (variables.status === 'DONE') {
        utils.students.imports.students.getOne.setData(
          {
            importId,
            id: importedData.id,
          },
          {
            status: 'DONE',
            import: importedData,
            current: variables.data!.current,
          },
        );
      }
      await utils.students.imports.previewResult.invalidate({ importId });
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
      data: { current: data, studentId: linkStudentId },
    });
  };

  return (
    <>
      <div>
        <h3 className="text-label-sm text-soft">Résultat final</h3>
        <SelectAnotherBaseStudent
          setLinkStudentId={setLinkStudentId}
          linkedStudent={linkedStudent ?? null}
        />
      </div>
      <BaseForm
        data={formBaseData}
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
                  {linkedStudent?.id !== undefined ? 'Mettre à jour' : 'Ajouter'}
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
  setLinkStudentId,
  linkedStudent,
}: {
  setLinkStudentId: (id: number | null) => void;
  linkedStudent: PossibleStudentData | null;
}) => {
  const [open, setOpen] = React.useState(false);
  const t = useScopedI18n('students.import.existing');

  const onClickRow = (event: React.MouseEvent<HTMLTableRowElement>, row: StudentData) => {
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
            : t(
                'linkedToStudent',
                // @ts-expect-error: issue with the translation params type
                {
                  name: linkedStudent.firstName + ' ' + linkedStudent.lastName,
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
              selectedRows={isLinked ? { [linkedStudent.id - 1]: true } : {}}
            />
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
