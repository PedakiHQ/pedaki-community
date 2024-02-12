import { SIDEBAR_STUDENTS_BUTTON } from '~/store/tutorial/data/constants.ts';
import {
  BASE_INFO,
  PROPERTIES,
  PROPERTIES_ADD_BUTTON,
  PROPERTIES_ADD_FORM,
  TUTORIAL_ID,
} from '~/store/tutorial/data/schema-student/constants.ts';
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

      // Open form
      if (isForward(props.action) && nextStepIndex === 5) {
        const button: HTMLButtonElement = document.querySelector(props.step.target as string)!;
        const isOpen = button.getAttribute('data-state') === 'open';
        if (!isOpen) {
          button.click();
          methods.setPaused(true);
          return;
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
  steps(t) {
    return [
      {
        target: `#${SIDEBAR_STUDENTS_BUTTON}`,
        content: t(`${TUTORIAL_ID}.steps.sidebarSubmenu.content`),
        placement: 'right-end',
        disableBeacon: true,
      },
      {
        target: `#${SIDEBAR_STUDENTS_BUTTON}-schema`,
        content: t(`${TUTORIAL_ID}.steps.navigate.content`),
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: `#${BASE_INFO}`,
        content: t(`${TUTORIAL_ID}.steps.mainContent.content`),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: `#${PROPERTIES}`,
        content: t(`${TUTORIAL_ID}.steps.mainContent.content`),
        placement: 'top',
        disableBeacon: true,
      },
      {
        target: `#${PROPERTIES_ADD_BUTTON}`,
        content: t(`${TUTORIAL_ID}.steps.mainContent.content`),
        placement: 'top',
        disableBeacon: true,
      },
      {
        target: `#${PROPERTIES_ADD_FORM}`,
        content: t(`${TUTORIAL_ID}.steps.mainContent.content`),
        placement: 'top',
        disableBeacon: true,
      },
    ];
  },
};
