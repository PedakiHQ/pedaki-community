'use client';

import { tutorialLocale } from '~/store/tutorial/data/locale.ts';
import { useTutorialStore } from '~/store/tutorial/tutorial.store.ts';
import { useRouter } from 'next/navigation';
import React from 'react';
import Joyride from 'react-joyride';

interface TutorialProviderProps {
  locale: string;
}

const TutorialProvider = ({ locale }: TutorialProviderProps) => {
  const tutorial = useTutorialStore(state => state.tutorial);
  const paused = useTutorialStore(state => state.paused);
  const stepIndex = useTutorialStore(state => state.stepIndex);

  const methods = useTutorialStore(state => ({
    setStepIndex: state.setStepIndex,
    setPaused: state.setPaused,
    addCompleted: state.addCompleted,
    setTutorial: state.setTutorial,
  }));
  const router = useRouter();

  if (!tutorial) return null;

  const { options = {}, callback, steps } = tutorial;
  const { styles = {}, ...restOptions } = options;
  const { options: stylesOptions = {}, ...restStyles } = styles;

  return (
    <Joyride
      // eslint-disable-next-line @typescript-eslint/unbound-method
      callback={callback?.({ ...methods, push: router.push })}
      continuous
      {...restOptions}
      run={!paused}
      stepIndex={stepIndex}
      steps={steps(locale)}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: 'var(--tw-primary-base)',
          ...stylesOptions,
        },
        ...restStyles,
      }}
      locale={tutorialLocale(locale)}
      disableOverlayClose
      disableScrolling
      showProgress
    />
  );
};

export default TutorialProvider;
