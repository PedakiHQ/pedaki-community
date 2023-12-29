'use client';

import { IconCircle } from '@pedaki/design/ui/icons';
import IconCheck from '@pedaki/design/ui/icons/IconCheck';
import { cn } from '@pedaki/design/utils';
import { tutorials } from '~/store/tutorial/data';
import { useTutorialStore } from '~/store/tutorial/tutorial.store.ts';
import type { Tutorial } from '~/store/tutorial/type.ts';
import { useIsSmall } from '~/utils.ts';
import React from 'react';
import { toast } from 'sonner';

const TutorialCardBody = () => {
  const completed = useTutorialStore(state => state.completed);
  const setTutorial = useTutorialStore(state => state.setTutorial);
  const isSmall = useIsSmall();

  const handleTutorialClick = (tutorial: Tutorial) => {
    if (isSmall) {
      toast.error('Tutorials are not available on mobile devices');
      return;
    }
    setTutorial(tutorial);
  };

  return (
    <ul className="space-y-4 p-1">
      {tutorials.map(tutorial => {
        const isCompleted = completed.includes(tutorial.id);
        const Icon = isCompleted ? IconCheck : IconCircle;
        return (
          <li key={tutorial.id}>
            <button
              className="focus-ring flex w-full gap-2 rounded-md p-2 text-left hover:bg-weak"
              onClick={() => handleTutorialClick(tutorial)}
            >
              <div className="flex h-8 w-8 items-center justify-center">
                <Icon className={cn('h-4 w-4', isCompleted ? 'text-state-success' : 'text-sub')} />
              </div>
              <div className="flex flex-col justify-start">
                <span className="text-label-sm font-medium">{tutorial.id}</span>
                <span className="text-sub-xs text-sub">{tutorial.id}</span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default TutorialCardBody;
