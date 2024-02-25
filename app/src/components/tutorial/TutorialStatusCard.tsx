import { Card, CardContent, CardHeader, CardTitle } from '@pedaki/design/ui/card';
import { IconBookMarked } from '@pedaki/design/ui/icons';
import { ScrollArea } from '@pedaki/design/ui/scroll-area';
import { Separator } from '@pedaki/design/ui/separator';
import TutorialCardBody from '~/components/tutorial/TutorialCardBody.tsx';
import { getScopedI18n } from '~/locales/server';
import React from 'react';

const TutorialStatusCard = async () => {
  const t = await getScopedI18n('tutorial');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconBookMarked className="h-6 w-6 text-sub" />
          <span>{t('main.title')}</span>
        </CardTitle>
      </CardHeader>
      <Separator className="-ml-4 w-[calc(100%+2rem)]" />
      <CardContent>
        <ScrollArea className="h-96">
          <TutorialCardBody />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TutorialStatusCard;
