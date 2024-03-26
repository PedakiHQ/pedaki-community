'use client';

import { Card } from '@pedaki/design/ui/card';
import { Separator } from '@pedaki/design/ui/separator';
import { Skeleton } from '@pedaki/design/ui/skeleton';
import { useIdParam } from '~/components/students/import/parameters.ts';
import Existing from '~/components/students/import/student/existing.tsx';
import Imported from '~/components/students/import/student/imported.tsx';
import { api } from '~/server/clients/client.ts';
import {
  IMPORT_DIFF_LEFT,
  IMPORT_DIFF_RIGHT,
} from '~/store/tutorial/data/upload-students/constants.ts';
import type { OutputType } from '~api/router/router.ts';
import React, { Suspense, useEffect } from 'react';
import { toast } from 'sonner';

interface StudentDiffProps {
  importId: string;
}

const StudentDiff = ({ importId }: StudentDiffProps) => {
  const [selected] = useIdParam();

  return (
    <Suspense fallback={<SuspenseCard />}>
      {selected === null ? (
        typeof window === 'undefined' ? (
          <SuspenseCard />
        ) : (
          <NoContent />
        )
      ) : (
        <ContentWrapper importId={importId} id={selected} />
      )}
    </Suspense>
  );
};

const SuspenseCard = () => {
  return <Skeleton className="border" />;
};

const NoContent = () => {
  return <Card className="h-full w-full">No content</Card>;
};

// in the result data add _ in prefix to every properties
const transformData = (
  student: OutputType['students']['imports']['students']['getOne']['current'],
) => {
  if (!student) return null;
  const transformedStudent = { ...student, properties: {} } as typeof student & {
    properties: Record<string, any>;
  };
  for (const [key, value] of Object.entries(student.properties!)) {
    transformedStudent.properties[`_${key}`] = value;
  }
  return transformedStudent;
};

const ContentWrapper = ({ importId, id }: StudentDiffProps & { id: number }) => {
  const [result, { isError, isLoading }] = api.students.imports.students.getOne.useSuspenseQuery({
    importId,
    id,
  });

  const {
    data: properties,
    isLoading: propertiesLoading,
    isError: propertiesError,
  } = api.students.properties.getMany.useQuery(undefined);

  useEffect(() => {
    if (isError) {
      toast.error('Error fetching data', {
        id: 'error-fetching-data',
      });
    }
  }, [isError]);

  if (isLoading || isError || propertiesLoading || propertiesError || !properties) {
    return <SuspenseCard />;
  }

  return (
    <Card className="relative flex h-min w-full flex-row">
      <div className="flex-1" id={IMPORT_DIFF_LEFT}>
        <Imported baseData={result.import} status={result.status} properties={properties} />
      </div>
      <Separator orientation="vertical" />
      <div className="flex-1" id={IMPORT_DIFF_RIGHT}>
        <Existing
          baseData={transformData(result.current)}
          importedData={transformData(result.import)!}
          importId={importId}
          key={id}
          status={result.status}
          properties={properties}
        />
      </div>
    </Card>
  );
};

export default StudentDiff;
