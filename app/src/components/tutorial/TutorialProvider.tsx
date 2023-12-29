'use client';

import { tutorialLocale } from '~/store/tutorial/data/locale.ts';
import { useTutorialStore } from '~/store/tutorial/tutorial.store.ts';
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

  if (!tutorial) return null;

  const { options = {}, callback, steps } = tutorial;
  const { styles = {}, ...restOptions } = options;
  const { options: stylesOptions = {}, ...restStyles } = styles;

  return (
    <Joyride
      callback={callback?.(methods)}
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
    />
  );
};

export default TutorialProvider;
