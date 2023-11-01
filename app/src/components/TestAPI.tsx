'use client';

import { api } from '~/server/clients/client';

export default function TestAPI() {
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
