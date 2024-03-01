'use client';

import { Dialog, DialogContent, DialogTrigger } from '@pedaki/design/ui/dialog';
import Client from '~/components/students/list/client.tsx';
import React from 'react';

const ImportStudents = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={'w-full rounded-lg border-2 border-dashed p-6 shadow-sm'}>
          Séléctionner les élèves
        </button>
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
  );
};

export default ImportStudents;
