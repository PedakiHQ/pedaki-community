'use client';

import { Button } from '@pedaki/design/ui/button';
import { api } from '~/server/clients/client.ts';
import React from 'react';

export const TestSettingComponent = () => {
  const setSettingMutation = api.workspace.setSetting.useMutation();

  return (
    <Button
      onClick={() => {
        void setSettingMutation.mutateAsync({ key: 'NAME', value: 'oui' });
      }}
    >
      change workspace name
    </Button>
  );
};
