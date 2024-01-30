import { MAIN_CONTENT, SIDEBAR_CLASSES_BUTTON } from '~/store/tutorial/data/constants.ts';
import { TUTORIAL_ID } from '~/store/tutorial/data/generate-classes/constants.ts';
import {
  getNextStepIndex,
  isCompleted,
  isExited,
  isForward,
  isNextStep,
} from '~/store/tutorial/data/utils.ts';
import type { Tutorial } from '~/store/tutorial/type.ts';

export const generateClassesTutorial: Tutorial = {
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
        methods.push('/classes/generate');
        return;
      }

      methods.setStepIndex(nextStepIndex);
    }
  },
  steps(t) {
    return [
      {
        target: `#${SIDEBAR_CLASSES_BUTTON}`,
        content: t(`${TUTORIAL_ID}.steps.sidebarSubmenu.content`),
        placement: 'right-end',
        disableBeacon: true,
      },
      {
        target: `#${SIDEBAR_CLASSES_BUTTON}-generate`,
        content: t(`${TUTORIAL_ID}.steps.navigate.content`),
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: `#${MAIN_CONTENT}`,
        content: t(`${TUTORIAL_ID}.steps.mainContent.content`),
        placement: 'center',
        disableBeacon: true,
      },
    ];
  },
};
