'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@pedaki/design/ui/card';
import { IconListOrdered } from '@pedaki/design/ui/icons';
import { Separator } from '@pedaki/design/ui/separator';
import { useRulesParams } from '~/components/classes/generate/parameters.tsx';
import Entry from '~/components/classes/generate/rules/entry.tsx';
import RulesTrigger from '~/components/classes/generate/rules/rules-trigger.tsx';
import { SortableList } from '~/components/dnd/SortableList.tsx';
import { useGlobalStore } from '~/store/global/global.store.ts';
import React from 'react';

const RulesCard = () => {
  // TODO: this is disgusting, find a better way to handle this
  const demoBannerVisible = useGlobalStore(state => state.demoBannerVisible);

  return (
    <Card className={demoBannerVisible ? 'h-[calc(100vh-31rem)]' : 'h-[calc(100vh-28rem)]'}>
      <CardHeader>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <IconListOrdered className="h-6 text-sub" />
            <div>
              {/*TODO: trads*/}
              <CardTitle>Regles</CardTitle>
              <CardDescription>Les règles s&apos;éxecutent de haut en bas</CardDescription>
            </div>
          </div>

          <RulesTrigger />
        </div>
      </CardHeader>
      <Separator className="-ml-4 w-[calc(100%+2rem)]" />
      <CardContent className="relative flex-shrink overflow-y-auto overflow-x-hidden pr-4">
        <DragArea />
      </CardContent>
    </Card>
  );
};

const DragArea = () => {
  const [rules, setRules] = useRulesParams();

  return (
    <SortableList
      items={rules ?? []}
      onChange={setRules}
      renderItem={(item, index) => <Entry item={item} index={index} />}
    />
  );
};

export default RulesCard;
