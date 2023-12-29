import { SIDEBAR_SETTINGS_BUTTON } from '~/store/tutorial/data/appearance/constants.ts';
import {
  getNextStepIndex,
  isCompleted,
  isExited,
  isNextStep,
} from '~/store/tutorial/data/utils.ts';
import type { Tutorial, TutorialStep } from '~/store/tutorial/type.ts';

const id = 'appearance';
export const appearanceTutorial: Tutorial = {
  id,
  callback: methods => props => {
    if (isExited(props.status, props.action)) {
      methods.setTutorial(null);
      return;
    }
    if (isCompleted(props.status)) {
      methods.addCompleted(id);
      return;
    }

    if (isNextStep(props.type)) {
      methods.setStepIndex(getNextStepIndex(props.index, props.action));
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
        target: `body`,
        content: 'main',
        placement: 'center',
        disableBeacon: true,
      },
    ];
  },
};
