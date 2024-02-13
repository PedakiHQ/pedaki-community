import { SIDEBAR_STUDENTS_BUTTON } from '~/store/tutorial/data/constants.ts';
import {
  IMPORT_ACTIONS,
  IMPORT_CONTENT_NAVIGATION,
  IMPORT_DIFF_LEFT,
  IMPORT_DIFF_LINK,
  IMPORT_DIFF_RIGHT,
  STUDENTS_IMPORT_PAGE_BUTTON,
  TUTORIAL_ID,
  UPLOAD_BUTTON,
  UPLOAD_MODAL,
} from '~/store/tutorial/data/upload-students/constants.ts';
import {
  getNextStepIndex,
  isCompleted,
  isExited,
  isForward,
  isNextStep,
} from '~/store/tutorial/data/utils.ts';
import type { Tutorial } from '~/store/tutorial/type.ts';

export const uploadStudentsTutorial: Tutorial = {
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
        const isOpen = button?.getAttribute('data-state') === 'open';
        if (!isOpen) {
          button.click();
        }
      }

      if (isForward(props.action) && nextStepIndex === 2) {
        methods.setPaused(true);
        methods.push('/students');
        return;
      }

      // Open modal
      if (isForward(props.action) && nextStepIndex === 3) {
        const button: HTMLButtonElement = document.querySelector(props.step.target as string)!;
        const isOpen = button.getAttribute('data-state') === 'open';
        if (!isOpen) {
          button.click();
          methods.setPaused(true);
          return;
        }
      }

      // Wait for upload
      if (isForward(props.action) && nextStepIndex === 4) {
        methods.setPaused(true);
        return;
      }

      // Go to students import page
      if (isForward(props.action) && nextStepIndex === 5) {
        methods.setPaused(true);
        methods.push(window.location.pathname + '/students');
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
        target: `#${SIDEBAR_STUDENTS_BUTTON}-list`,
        content: t(`${TUTORIAL_ID}.steps.navigate.content`),
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: `#${UPLOAD_BUTTON}`,
        content: t(`${TUTORIAL_ID}.steps.importButton.content`),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: `#${UPLOAD_MODAL}`,
        content: t(`${TUTORIAL_ID}.steps.modal.content`),
        placement: 'bottom',
        disableBeacon: true,
        styles: {
          tooltip: {
            // TODO: maybe move this to the global styles
            pointerEvents: 'all',
            zIndex: 1000000,
          },
        },
      },
      {
        target: `#${STUDENTS_IMPORT_PAGE_BUTTON}`,
        content: t(`${TUTORIAL_ID}.steps.studentTab.content`),
        placement: 'bottom',
        disableBeacon: true,
        hideBackButton: true,
      },
      {
        target: `#${IMPORT_CONTENT_NAVIGATION}`,
        content: t(`${TUTORIAL_ID}.steps.navigation.content`),
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: `#${IMPORT_DIFF_LEFT}`,
        content: t(`${TUTORIAL_ID}.steps.leftSide.content`),
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: `#${IMPORT_DIFF_RIGHT}`,
        content: t(`${TUTORIAL_ID}.steps.rightSide.content`),
        placement: 'left',
        disableBeacon: true,
      },
      {
        target: `#${IMPORT_DIFF_LINK}`,
        content: t(`${TUTORIAL_ID}.steps.link.content`),
        placement: 'left',
        disableBeacon: true,
      },
      {
        target: `#${IMPORT_ACTIONS}`,
        content: t(`${TUTORIAL_ID}.steps.actions.content`),
        placement: 'left',
        disableBeacon: true,
      },
    ];
  },
};
