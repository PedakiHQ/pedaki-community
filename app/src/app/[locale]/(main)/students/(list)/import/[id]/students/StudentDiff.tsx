'use client';

import { Card } from '@pedaki/design/ui/card';
import { Separator } from '@pedaki/design/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@pedaki/design/ui/sheet';
import { Skeleton } from '@pedaki/design/ui/skeleton';
import { useIdParam } from '~/components/students/import/parameters.ts';
import Client from '~/components/students/list/client.tsx';
import type { StudentData } from '~/components/students/list/columns.tsx';
import { api } from '~/server/clients/client.ts';
import type { OutputType } from '~api/router/router.ts';
import React, { Suspense } from 'react';

interface StudentDiffProps {
  importId: string;
}

const StudentDiff = ({ importId }: StudentDiffProps) => {
  const [selected] = useIdParam();

  return (
    <Suspense fallback={<SuspenseCard />}>
      {selected === null ? <NoContent /> : <ContentWrapper importId={importId} id={selected} />}
    </Suspense>
  );
};

const SuspenseCard = () => {
  return <Skeleton className="border" />;
};

const NoContent = () => {
  return <Card className="h-full w-full">No content</Card>;
};

const ContentWrapper = ({ importId, id }: StudentDiffProps & { id: number }) => {
  const [result, { isError, isLoading }] = api.students.imports.students.getOne.useSuspenseQuery({
    importId,
    id,
  });

  if (isLoading || isError) {
    return <SuspenseCard />;
  }

  return <Content result={result} />;
};

const Content = ({
  result,
}: {
  result: OutputType['students']['imports']['students']['getOne'];
}) => {
  return (
    <Card className="flex h-full w-full flex-row">
      <div className="flex-1">
        <h3 className="text-label-sm text-soft">
          {/*    TODO */}
          Donnée importée
        </h3>
        <p className="text-label-sm text-soft">{result.import.firstName} {result.import.lastName}</p>
      </div>
      <Separator orientation="vertical" />
      <div className="flex-1">
        <h3 className="text-label-sm text-soft">
          {/*    TODO */}
          Donnée existante
        </h3>
        <SelectAnotherBaseStudent />
      </div>
    </Card>
  );
};

const SelectAnotherBaseStudent = () => {
  const [open, setOpen] = React.useState(false);

  const onClickRow = (row: StudentData) => {
    console.log(row);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="text-label-sm text-soft hover:underline">
        {/*TODO trads*/}
        Sélectionner un autre élève
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
  );
};

export default StudentDiff;
