'use server';

import { Dialog, DialogContent, DialogTrigger } from '@pedaki/design/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@pedaki/design/ui/sheet';
import Client from '~/components/students/list/client.tsx';
import StudentsListWrapper from '~/components/students/list/wrapper.tsx';
import React from 'react';

const DrawerWrapper = () => {
  return (
    <StudentsListWrapper>
      <div className="flex gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <button>Drawer ⬆️</button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <div className="p-4">
              <button></button>
              <Client />
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <button>Drawer ⬅️</button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
          >
            <div className="p-4">
              <button></button>
              <Client />
            </div>
          </SheetContent>
        </Sheet>

        <Dialog>
          <DialogTrigger asChild>
            <button>Modal</button>
          </DialogTrigger>
          <DialogContent className="max-h-[80%] md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl">
            <div className="w-full p-4">
              <button></button>
              <Client />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </StudentsListWrapper>
  );
};

export default DrawerWrapper;
