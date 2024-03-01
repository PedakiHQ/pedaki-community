'use client';

import { Button } from '@pedaki/design/ui/button';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { api } from '~/server/clients/client.ts';


const ResultActions = () => {
  const router = useRouter()

  const confirm = useCallback(() => {
    api.classes.create()
    router.push("/classes/edit/")
  }, [router])

  return (
    <div>
      <Button size="sm" onClick={confirm}>Valider</Button>
    </div>
  );
};

export default ResultActions;
