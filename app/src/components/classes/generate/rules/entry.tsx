import { Card } from '@pedaki/design/ui/card';
import { IconCircle } from '@pedaki/design/ui/icons';
import { cn } from '@pedaki/design/utils';
import React from 'react';
import classes from './entry.module.scss';

const Entry = () => {
  return (
    <div className={cn(classes.item, 'py-4')}>
      <div className={classes.badge}>
        <IconCircle className="fill-stroke-soft text-stroke-soft" />
      </div>
      <Card className="ml-2 flex w-full flex-1 pl-4">item</Card>
    </div>
  );
};

export default Entry;
