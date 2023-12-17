import AuthProvider from '~/app/[locale]/(main)/AuthProvider.tsx';
import Sidebar from '~/components/layout/Sidebar/Sidebar.tsx';
import React, { Suspense } from 'react';

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <div className="flex flex-1">
        <Sidebar />
        <main className="ml-[17rem] min-h-screen w-full gap-6 p-2 pl-0 peer-data-[collapsed=true]:ml-20">
          <div className="grid h-full grid-cols-12 rounded-lg border bg-white p-8 shadow-lg">
            <Suspense>{children}</Suspense>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
