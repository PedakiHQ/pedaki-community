import type { UseScopedI18nType } from '~/locales/client';
import type { TutorialStore } from '~/store/tutorial/tutorial.store.ts';
import type { BaseProps, CallBackProps, Step } from 'react-joyride';

export interface Tutorial {
  id: string;
  options?: BaseProps;
  steps: (t: UseScopedI18nType<'tutorial'>) => Step[];
  callback?: (
    props: Pick<TutorialStore, 'setTutorial' | 'setStepIndex' | 'setPaused' | 'addCompleted'> & {
      push: (url: string) => void;
    },
  ) => (props: CallBackProps) => void;
}
