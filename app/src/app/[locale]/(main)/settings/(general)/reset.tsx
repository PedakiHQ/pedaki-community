'use client';

import { Button } from '@pedaki/design/ui/button';
import ConfirmDangerModal from '~/components/ConfirmDangerModal.tsx';
import { api } from '~/server/clients/client.ts';
import React from 'react';
import { toast } from 'sonner';

const ResetWorkspaceButton = () => {
  // TODO: trads

  const resetWorkspaceMutation = api.data.reset.useMutation({
    onSuccess: () => {
      toast.success('Workspace reset', {
        id: 'reset-workspace',
      });
    },
  });

  const handleReset = () => {
    resetWorkspaceMutation.mutate(['import', 'student']);
  };

  return (
    <ConfirmDangerModal
      title="Reset Workspace"
      confirmText="Reset Workspace"
      cancelText="Annuler"
      trigger={<Button variant="filled-error">Reset Workspace</Button>}
      onConfirm={handleReset}
      description="Resetting your workspace will delete all your data and cannot be undone."
    >
      <div>
        <p></p>
      </div>
    </ConfirmDangerModal>
  );
};

export default ResetWorkspaceButton;
