'use client';

import { useTutorialNextStep } from '~/components/tutorial/useTutorialNextStep.tsx';
import { TUTORIAL_ID as UploadStudentsTutorialId } from '~/store/tutorial/data/upload-students/constants.ts';
import React from 'react';

const Bidule = () => {
  useTutorialNextStep(UploadStudentsTutorialId, 1);

  return <div>Bidule</div>;
};

export default Bidule;
