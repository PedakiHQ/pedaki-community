'use client';

import { useTutorialNextStep } from '~/components/tutorial/useTutorialNextStep.tsx';

const TutorialTrigger = ({ id, step }: { id: string; step: number }) => {
  useTutorialNextStep(id, step);

  return null;
};

export default TutorialTrigger;
