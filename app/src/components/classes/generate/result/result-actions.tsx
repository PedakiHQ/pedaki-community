'use client';

import { Button } from '@pedaki/design/ui/button';
import { api } from '~/server/clients/client.ts';
import { useClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

const ResultActions = () => {
  // const router = useRouter();
  const studentData = useClassesGenerateStore(store => store.studentData);
  const classesData = useClassesGenerateStore(store => store.classesData);

  const createClassesMutation = api.classes.create.createMany.useMutation()

  const confirm = useCallback(() => {
    const classes = classesData.map(c => ({
      name: c.id,
      description: 'oui',
      academicYear: { id: 1 },
      level: { id: 1 },
      branches: [{ id: 1 }],
      students: studentData.filter(s => s.containerId === c.id).map(s => s.id),
    })).filter(c => c.students.length)
    createClassesMutation.mutateAsync(classes);
    // router.push('/classes/edit/');
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
