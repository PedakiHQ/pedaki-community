'use server';

import { Card, CardContent, CardHeader, CardTitle } from '@pedaki/design/ui/card';
import { IconSettings } from '@pedaki/design/ui/icons';
import { Separator } from '@pedaki/design/ui/separator';
import SelectStudents from '~/components/classes/generate/select-students.tsx';
import React from 'react';

const ConfigurationCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <IconSettings className="h-6 text-sub" />
          <CardTitle>Configuration</CardTitle>
        </div>
      </CardHeader>
      <Separator className="-ml-4 w-[calc(100%+2rem)]" />
      <CardContent>
        <SelectStudents />
      </CardContent>
    </Card>
  );
};

export default ConfigurationCard;
