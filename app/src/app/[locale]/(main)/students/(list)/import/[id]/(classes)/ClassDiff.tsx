'use client';

import { Card } from '@pedaki/design/ui/card';
import { useIdParam } from '~/components/students/import/parameters.ts';
import React from 'react';

const ClassDiff = () => {
  const [selected] = useIdParam();

  return <Card className="h-full w-full"></Card>;
};

export default ClassDiff;
