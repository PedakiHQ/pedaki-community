'use client';

import { useScopedI18n } from '~/locales/client';
import { tutorialLocale } from '~/store/tutorial/data/locale.ts';
import { useTutorialStore } from '~/store/tutorial/tutorial.store.ts';
import { useRouter } from 'next/navigation';
import React from 'react';
import Joyride from 'react-joyride';

const TutorialProvider = () => {
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
  const t = useScopedI18n('tutorial');

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
      steps={steps(t)}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: 'var(--tw-primary-base)',
          ...stylesOptions,
        },
        ...restStyles,
      }}
      locale={tutorialLocale(t)}
      disableOverlayClose
      disableScrolling
      showProgress
    />
  );
};

export default TutorialProvider;
