'use client';

import { Button } from '@pedaki/design/ui/button';
import { IconPencil } from '@pedaki/design/ui/icons';
import { cn } from '@pedaki/design/utils';
import Client from '~/components/students/list/client';
import { useGlobalStore } from '~/store/global/global.store';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function StudentsListPageClient() {
  const demoBannerVisible = useGlobalStore(state => state.demoBannerVisible);
  const router = useRouter();

  return (
    <Client
      actionColumn={({ id }) => (
        <>
          <Button
            variant="lighter-primary"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={_event => router.push(`/students/edit/${id}`)}
            disabled={!id}
          >
            <IconPencil className="h-4 w-4" />
          </Button>
        </>
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
