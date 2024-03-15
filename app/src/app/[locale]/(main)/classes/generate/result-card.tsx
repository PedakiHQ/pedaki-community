import { Card, CardContent, CardHeader, CardTitle } from '@pedaki/design/ui/card';
import IconBookUser from '@pedaki/design/ui/icons/IconBookUser';
import { Separator } from '@pedaki/design/ui/separator';
import ClassesGrid from '~/components/classes/generate/result/classes-grid.tsx';
import RefetchQueryAction from '~/components/classes/generate/result/refetch-query-action.tsx';
import ResultActions from '~/components/classes/generate/result/result-actions.tsx';
import React from 'react';

const ResultCard = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-x-2 space-y-0">
        <div className="flex items-center space-x-2">
          <IconBookUser className="h-6 text-sub" />
          {/*TODO: trads*/}
          <CardTitle>Classes</CardTitle>
        </div>
        <ResultActions />
      </CardHeader>
      <Separator className="-ml-4 w-[calc(100%+2rem)]" />
      <CardContent className="flex flex-col gap-4 @container/classes">
        <RefetchQueryAction />
        <ClassesGrid />
      </CardContent>
    </Card>
  );
};

export default ResultCard;
