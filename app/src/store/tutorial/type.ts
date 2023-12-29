import type { TutorialStore } from '~/store/tutorial/tutorial.store.ts';
import type React from 'react';
import type { BaseProps, CallBackProps, Styles } from 'react-joyride';

export interface TutorialStep {
  target: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  styles?: Styles;
  content: React.ReactNode;
  disableBeacon?: boolean;
}

export interface Tutorial {
  id: string;
  options?: BaseProps;
  steps: (locale: string) => TutorialStep[];
  callback?: (
    props: Pick<TutorialStore, 'setTutorial' | 'setStepIndex' | 'setPaused' | 'addCompleted'>,
  ) => (props: CallBackProps) => void;
}
