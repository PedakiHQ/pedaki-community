import { useTutorialStore } from '~/store/tutorial/tutorial.store.ts';
import { useEffect } from 'react';

export const useTutorialNextStep = (tutorialId: string, expectedStep: number) => {
  const tutorial = useTutorialStore(state => state.tutorial);
  const stepIndex = useTutorialStore(state => state.stepIndex);
  const paused = useTutorialStore(state => state.paused);
  const setPaused = useTutorialStore(state => state.setPaused);
  const setStepIndex = useTutorialStore(state => state.setStepIndex);

  useEffect(() => {
    if (!tutorial || !paused) return;
    if (tutorial.id !== tutorialId) return;
    if (stepIndex !== expectedStep) return;

    setPaused(false);
    setStepIndex(stepIndex + 1);
  }, [tutorial, paused, stepIndex, tutorialId, expectedStep, setPaused, setStepIndex]);
};
