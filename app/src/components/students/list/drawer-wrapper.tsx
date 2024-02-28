'use client';

import { Dialog, DialogContent, DialogTrigger } from '@pedaki/design/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@pedaki/design/ui/sheet';
import Client from '~/components/students/list/client.tsx';
import React from 'react';

const DrawerWrapper = () => {
  return (
    <div className="flex gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <button>Drawer ⬆️</button>
        </SheetTrigger>
        <SheetContent side="bottom" onOpenAutoFocus={e => e.preventDefault()}>
          <div className="p-4">
            <Client />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog>
        <DialogTrigger asChild>
          <button>Modal</button>
        </DialogTrigger>
        <DialogContent
          className="max-h-[80%] md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <div className="w-full p-4">
            <Client />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DrawerWrapper;
