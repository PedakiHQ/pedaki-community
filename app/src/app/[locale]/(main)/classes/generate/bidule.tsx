'use client';

import { useTutorialNextStep } from '~/components/tutorial/useTutorialNextStep.tsx';
import { TUTORIAL_ID as GenerateClassesTutorialId } from '~/store/tutorial/data/generate-classes/constants.ts';
import React from 'react';

const Bidule = () => {
  useTutorialNextStep(GenerateClassesTutorialId, 1);

  return <div>Bidule</div>;
};

export default Bidule;
