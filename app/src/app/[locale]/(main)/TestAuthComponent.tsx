import { signOut } from '@pedaki/auth/edge.ts';
import { Button } from '@pedaki/design/ui/button';
import React from 'react';

const TestAuthComponent = () => {
  return (
    <div className="bg-red-base">
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
