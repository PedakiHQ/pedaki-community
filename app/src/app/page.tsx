'use client';

import { api } from '~/server/clients/client';

function IndexPage() {
  const hello = api.hello.hello.useQuery(
    { text: 'client' },
    {
      refetchInterval: 1000,
    },
  );
  if (!hello.data) {
    return <div>Loadddding...</div>;
  }
  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
}

export default function Bidule() {
  return (
    <main className="yeye flex min-h-screen flex-col items-center justify-between p-24">
        <IndexPage />
      <p>{process.env.NEXT_PUBLIC_TESTVALUE}</p>
        <p>bidule</p>
        <p>rebidule</p>
    </main>
  );
}
