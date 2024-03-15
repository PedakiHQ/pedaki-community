'use client';

import { Button } from '@pedaki/design/ui/button';
import { serialize } from '~/components/classes/list/parameters.ts';
import { api } from '~/server/clients/client.ts';
import { useClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

const ResultActions = () => {
  const router = useRouter();
  const studentData = useClassesGenerateStore(store => store.studentData);
  const classesData = useClassesGenerateStore(store => store.classesData);

  const createClassesMutation = api.classes.create.createMany.useMutation();

  const confirm = useCallback(async () => {
    const classes = classesData
      .map(c => ({
        name: c.id,
        students: studentData.filter(s => s.containerId === c.id).map(s => s.id),
      }))
      .filter(c => c.students.length);

    // TODO: withLoading
    await createClassesMutation.mutateAsync(classes);

    const params = serialize({
      filters: [
        {
          field: 'status',
          operator: 'eq',
          value: 'PENDING',
        },
      ],
      columns: {
        name: true,
        status: true,
      },
    });

    router.push(`/classes${params}`);
  }, [createClassesMutation]);

  return (
    <div>
      <Button size="sm" onClick={confirm}>
        Valider
      </Button>
    </div>
  );
};

export default ResultActions;
