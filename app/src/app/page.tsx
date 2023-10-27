'use client';
import { api } from '../utils/trpc';

function IndexPage() {
  const hello = api.hello.useQuery({ text: 'client' });
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{process.env.NEXT_PUBLIC_TESTVALUE}</p>
      <IndexPage />
    </main>
  );
}
