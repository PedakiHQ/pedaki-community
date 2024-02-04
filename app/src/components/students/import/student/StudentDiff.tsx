'use client';

import { Card } from '@pedaki/design/ui/card';
import { Separator } from '@pedaki/design/ui/separator';
import { Skeleton } from '@pedaki/design/ui/skeleton';
import { useIdParam } from '~/components/students/import/parameters.ts';
import Existing from '~/components/students/import/student/existing.tsx';
import Imported from '~/components/students/import/student/imported.tsx';
import { api } from '~/server/clients/client.ts';
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

  return (
    <Card className="relative flex h-min w-full flex-row">
      <div className="flex-1">
        <Imported baseData={result.import} />
      </div>
      <Separator orientation="vertical" />
      <div className="flex-1">
        <Existing
          baseData={result.current}
          importedData={result.import}
          importId={importId}
          key={id}
        />
      </div>
    </Card>
  );
};

export default StudentDiff;
