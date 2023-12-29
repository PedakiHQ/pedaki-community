'use client';

import { useTutorialNextStep } from '~/components/tutorial/useTutorialNextStep.tsx';
import { TUTORIAL_ID as SchemaStudentTutorialId } from '~/store/tutorial/data/schema-student/constants.ts';
import React from 'react';

const Bidule = () => {
  useTutorialNextStep(SchemaStudentTutorialId, 1);

  return <div>Bidule</div>;
};

export default Bidule;
