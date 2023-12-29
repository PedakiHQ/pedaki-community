import { MAIN_CONTENT, SIDEBAR_STUDENTS_BUTTON } from '~/store/tutorial/data/constants.ts';
import { TUTORIAL_ID } from '~/store/tutorial/data/schema-student/constants.ts';
import {
  getNextStepIndex,
  isCompleted,
  isExited,
  isForward,
  isNextStep,
} from '~/store/tutorial/data/utils.ts';
import type { Tutorial } from '~/store/tutorial/type.ts';

export const schemaStudentTutorial: Tutorial = {
  id: TUTORIAL_ID,
  callback: methods => props => {
    if (isExited(props.status, props.action)) {
      if (isCompleted(props.status)) {
        methods.addCompleted(TUTORIAL_ID);
      }
      methods.setTutorial(null);
      return;
    }

    if (isNextStep(props.type)) {
      const nextStepIndex = getNextStepIndex(props.index, props.action);

      // Open collapsible
      if (isForward(props.action) && nextStepIndex === 1) {
        const button = document.querySelector(props.step.target as string)!.parentElement!;
        const isOpen = button.getAttribute('data-state') === 'open';
        if (!isOpen) {
          button.click();
        }
      }

      if (isForward(props.action) && nextStepIndex === 2) {
        methods.setPaused(true);
        methods.push('/students/schema');
        return;
      }

      methods.setStepIndex(nextStepIndex);
    }
  },
  steps(locale) {
    return [
      {
        target: `#${SIDEBAR_STUDENTS_BUTTON}`,
        content: locale,
        placement: 'right-end',
        disableBeacon: true,
      },
      {
        target: `#${SIDEBAR_STUDENTS_BUTTON}-schema`,
        content: locale,
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: `#${MAIN_CONTENT}`,
        content: locale,
        placement: 'center',
        disableBeacon: true,
      },
    ];
  },
};
