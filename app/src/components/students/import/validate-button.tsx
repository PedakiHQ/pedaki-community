'use client';

import { Button } from '@pedaki/design/ui/button';
import { useScopedI18n } from '~/locales/client.ts';
import React from 'react';

const ValidateButton = () => {
  const t = useScopedI18n('students.import');

  return <Button>Valider</Button>;
};

export default ValidateButton;
