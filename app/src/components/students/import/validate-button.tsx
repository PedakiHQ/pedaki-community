'use client';

import { Button } from '@pedaki/design/ui/button';
import { Card } from '@pedaki/design/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@pedaki/design/ui/dialog';
import { IconSpinner } from '@pedaki/design/ui/icons';
import { Skeleton } from '@pedaki/design/ui/skeleton';
import { cn } from '@pedaki/design/utils';
import { useScopedI18n } from '~/locales/client.ts';
import { api } from '~/server/clients/client.ts';
import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';
import { toast } from 'sonner';

const ValidateButton = ({ importId }: { importId: string }) => {
  const t = useScopedI18n('students.import.confirmation');
  const [open, setOpen] = React.useState(false);
  const [isTransitionLoading, startTransition] = React.useTransition();

  const router = useRouter();
  const utils = api.useUtils();

  const confirmMutation = api.students.imports.confirm.useMutation({
    onSuccess: async () => {
      setOpen(false);

      toast.success('Import succeeded', {
        id: 'import-succeeded',
      });
      await utils.students.invalidate();
      await utils.classes.invalidate();
      router.push('/students');
    },
    onError: () => {
      toast.error('Import failed', {
        id: 'import-failed',
      });
    },
  });

  const confirm = () => {
    startTransition(() => {
      confirmMutation.mutate({ id: importId });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="stroke-primary-main">{t('button')}</Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[80%] overflow-hidden sm:max-w-screen-sm"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <Card className="flex h-full flex-col bg-weak">
          <Suspense fallback={<Skeleton className="h-36" />}>
            <Content importId={importId} />
          </Suspense>
        </Card>
        <div className="flex justify-end gap-2">
          <Button variant="stroke-primary-main" onClick={() => setOpen(false)}>
            {t('actions.cancel')}
          </Button>
          <Button variant="filled-primary" onClick={confirm} disabled={confirmMutation.isPending}>
            <div className={cn('pr-2', !isTransitionLoading && 'hidden')}>
              <IconSpinner className="h-5 w-5 animate-spin text-primary-base" />
            </div>
            {t('actions.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Content = ({ importId }: { importId: string }) => {
  const [data] = api.students.imports.previewResult.useSuspenseQuery(
    { importId },
    {
      refetchOnMount: true,
    },
  );

  return (
    <div className="flex flex-col gap-2">
      <StatsContent data={data.students} type="students" />
      <StatsContent data={data.classes} type="classes" />
    </div>
  );
};

const StatsContent = ({
  data,
  type,
}: {
  data: Record<'added' | 'updated', number>;
  type: 'students' | 'classes';
}) => {
  const t = useScopedI18n(`students.import.confirmation.${type}`);

  return (
    <div>
      <h3 className="mb-2 tracking-tight text-sub">{t('title')}</h3>
      <div className="flex flex-col">
        {Object.entries(data)
          .toSorted()
          .map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{t(key as any)}</span>
              <span>{value}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ValidateButton;
