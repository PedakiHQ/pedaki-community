'use client';

import { Button } from '@pedaki/design/ui/button';
import { api } from '~/server/clients/client.ts';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

const ResultActions = () => {
  const router = useRouter();

  const confirm = useCallback(() => {
    api.classes.create();
    router.push('/classes/edit/');
  }, [router]);

  return (
    <div>
      <Button size="sm" onClick={confirm}>
        Valider
      </Button>
    </div>
  );
};

export default ResultActions;
