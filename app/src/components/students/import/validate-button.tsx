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
import { Skeleton } from '@pedaki/design/ui/skeleton';
import { useScopedI18n } from '~/locales/client.ts';
import { api } from '~/server/clients/client.ts';
import React, { Suspense } from 'react';

const ValidateButton = ({ importId }: { importId: string }) => {
  const t = useScopedI18n('students.import.confirmation');

  return (
    <Dialog>
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
          <Button variant="stroke-primary-main">{t('actions.cancel')}</Button>
          <Button variant="filled-primary">{t('actions.confirm')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Content = ({ importId }: { importId: string }) => {
  const [data, { isLoading, isError }] = api.students.imports.previewResult.useSuspenseQuery(
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
        {Object.entries(data).map(([key, value]) => (
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
