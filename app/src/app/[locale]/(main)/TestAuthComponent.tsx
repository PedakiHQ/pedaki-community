import { auth, signOut } from '@pedaki/auth/edge.ts';
import { Button } from '@pedaki/design/ui/button';
import React from 'react';

const TestAuthComponent = async () => {
  const session = await auth();

  return (
    <div>
      <div className="max-w-screen-lg overflow-auto">
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button>Sign out</Button>
      </form>
    </div>
  );
};

export default TestAuthComponent;
