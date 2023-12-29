import {
  APPEARANCE_FORM,
  SIDEBAR_SETTINGS_BUTTON,
  TUTORIAL_ID,
} from '~/store/tutorial/data/appearance/constants.ts';
import {
  getNextStepIndex,
  isCompleted,
  isExited,
  isNextStep,
} from '~/store/tutorial/data/utils.ts';
import type { Tutorial, TutorialStep } from '~/store/tutorial/type.ts';

export const appearanceTutorial: Tutorial = {
  id: TUTORIAL_ID,
  callback: methods => props => {
    if (isExited(props.status, props.action)) {
      methods.setTutorial(null);
      return;
    }
    if (isCompleted(props.status)) {
      methods.addCompleted(TUTORIAL_ID);
      return;
    }

    if (isNextStep(props.type)) {
      const nextStepIndex = getNextStepIndex(props.index, props.action);
      if (nextStepIndex === 1) {
        methods.setPaused(true);
        methods.push('/settings');
        return;
      }

      if (nextStepIndex === 0) {
        methods.push('/');
        methods.setTutorial(null); // Exit tutorial
        return;
      }

      methods.setStepIndex(nextStepIndex);
    }
  },
  steps(locale: string): TutorialStep[] {
    return [
      {
        target: `#${SIDEBAR_SETTINGS_BUTTON}`,
        content: locale,
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: `#main-content`,
        content: 'main',
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: `#${APPEARANCE_FORM}`,
        content: 'main',
        placement: 'bottom',
        disableBeacon: true,
      },
    ];
  },
};
