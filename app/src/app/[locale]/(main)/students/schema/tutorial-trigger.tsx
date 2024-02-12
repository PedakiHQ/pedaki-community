'use client';

import { useTutorialNextStep } from '~/components/tutorial/useTutorialNextStep.tsx';
import { TUTORIAL_ID } from '~/store/tutorial/data/schema-student/constants.ts';

const TutorialTrigger = () => {
  useTutorialNextStep(TUTORIAL_ID, 1);

  return null;
};

export default TutorialTrigger;
