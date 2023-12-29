import {
  APPEARANCE_FORM,
  SIDEBAR_SETTINGS_BUTTON,
  TUTORIAL_ID,
} from '~/store/tutorial/data/appearance/constants.ts';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import {
  getNextStepIndex,
  isCompleted,
  isExited,
  isForward,
  isNextStep,
} from '~/store/tutorial/data/utils.ts';
import type { Tutorial } from '~/store/tutorial/type.ts';

export const appearanceTutorial: Tutorial = {
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
      if (isForward(props.action) && nextStepIndex === 1) {
        methods.setPaused(true);
        methods.push('/settings');
        return;
      }

      methods.setStepIndex(nextStepIndex);
    }
  },
  steps(locale) {
    return [
      {
        target: `#${SIDEBAR_SETTINGS_BUTTON}`,
        content: locale,
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: `#${MAIN_CONTENT}`,
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
