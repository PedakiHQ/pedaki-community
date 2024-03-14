'use client';

import { wrapWithLoading } from '@pedaki/common/utils/wrap-with-loading';
import { Button } from '@pedaki/design/ui/button';
import { IconPencil, IconTrash } from '@pedaki/design/ui/icons';
import { cn } from '@pedaki/design/utils';
import ConfirmDangerModal from '~/components/ConfirmDangerModal';
import Client from '~/components/students/list/client';
import { api } from '~/server/clients/client';
import { useGlobalStore } from '~/store/global/global.store';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function StudentsListPageClient() {
  const demoBannerVisible = useGlobalStore(state => state.demoBannerVisible);
  const router = useRouter();

  const deletePropertyMutation = api.students.deleteOne.useMutation();
  const onDelete = async (data: { id: number }) => {
    return wrapWithLoading(
      async () => {
        await deletePropertyMutation.mutateAsync(data);
        // TODO update cache
      },
      {
        // TODO trads
        errorProps: e => ({
          title: e.message,
        }),
        loadingProps: {},
        successProps: {},
        throwOnError: false,
      },
    );
  };

  return (
    <Client
      actionColumn={student => (
        <div className='flex gap-2'>
          <Button
            variant="lighter-primary"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => router.push(`/students/edit/${student.id}`)}
            disabled={!student.id}
          >
            <IconPencil className="h-4 w-4" />
          </Button>
          {/* TODO trads */}
          <ConfirmDangerModal
            title="Supprimer un élève"
            confirmText="Supprimer"
            cancelText="Annuler"
            trigger={
              <Button
                variant="ghost-error"
                className="h-6 w-6 shrink-0"
                size="icon"
                disabled={!student.id}
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            }
            onConfirm={() => onDelete({ id: student.id })}
            description={`Vous êtes sur le point de supprimer ${student.firstName} ${student.lastName}. This action cannot be undone.`}
          />
        </div>
      )}
      className={cn(
        // TODO: find a better way to do this
        // header has a h-14 => 3.5rem, with a pb-3 => 0.75rem
        // body has a padding of 0.5rem top and bottom => 1rem
        // @container/main has a p-6 (top and bottom) => 2 * 1.5rem = 3rem
        // #main-content has a pt-6 => 1.5rem
        // total is : 3.5rem + 0.75rem + 1rem + 3rem + 1.5rem = 9.75rem
        !demoBannerVisible && 'sm:max-h-[calc(100vh-9.75rem)]',
        // the demo banner has a height of h-12 => 3rem
        // total is 9.75rem + 3rem = 12.75rem
        demoBannerVisible && 'sm:max-h-[calc(100vh-12.75rem)]',
        // below sm there is a mt-[4rem]
        // total is 9.75rem + 4rem = 13.75rem
        !demoBannerVisible && 'max-h-[calc(100vh-13.75rem)]',
        // with the demo banner
        // total is 12.75rem + 4rem = 16.75rem
        demoBannerVisible && 'max-h-[calc(100vh-16.75rem)]',
      )}
    />
  );
}
