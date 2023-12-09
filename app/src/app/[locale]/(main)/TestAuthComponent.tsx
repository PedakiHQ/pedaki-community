'use client';

import { useSession } from 'next-auth/react';
import React from 'react';

const TestAuthComponent = () => {
  const session = useSession();

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
};

export default TestAuthComponent;
