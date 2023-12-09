'use client';

import { useSession } from 'next-auth/react';
import React from 'react';

const TestAuthComponent = () => {
  const session = useSession();

  return (
    <div className="max-w-screen-lg overflow-auto">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default TestAuthComponent;
