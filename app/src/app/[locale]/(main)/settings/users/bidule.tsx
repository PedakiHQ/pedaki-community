'use client';

import { useTutorialNextStep } from '~/components/tutorial/useTutorialNextStep.tsx';
import { TUTORIAL_ID as UsersTutorialId } from '~/store/tutorial/data/users/constants.ts';
import React from 'react';

const Bidule = () => {
  useTutorialNextStep(UsersTutorialId, 2);

  return <div>Bidule</div>;
};

export default Bidule;
