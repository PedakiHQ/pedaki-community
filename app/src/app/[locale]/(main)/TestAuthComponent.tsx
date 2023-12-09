import { auth } from '@pedaki/auth/edge.ts';
import React from 'react';

const TestAuthComponent = async () => {
  const session = await auth();

  return (
    <div className="max-w-screen-lg overflow-auto">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default TestAuthComponent;
