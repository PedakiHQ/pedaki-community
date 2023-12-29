import {
  MAIN_CONTENT,
  SETTINGS_NAVIGATION,
  SETTINGS_NAVIGATION_USERS,
  SIDEBAR_SETTINGS_BUTTON,
} from '~/store/tutorial/data/constants.ts';
import { TUTORIAL_ID } from '~/store/tutorial/data/users/constants.ts';
import {
  getNextStepIndex,
  isCompleted,
  isExited,
  isForward,
  isNextStep,
} from '~/store/tutorial/data/utils.ts';
import type { Tutorial } from '~/store/tutorial/type.ts';

export const usersTutorial: Tutorial = {
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

      if (isForward(props.action) && nextStepIndex === 3) {
        methods.setPaused(true);
        methods.push('/settings/users');
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
        target: `#${SETTINGS_NAVIGATION}`,
        content: 'vous pouvez changer de page en utilisatn la barre de navigation',
        placement: 'bottom',
      },
      {
        target: `#${SETTINGS_NAVIGATION_USERS}`,
        content: 'rejoindre la page des utilisateurs',
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: `#${MAIN_CONTENT}`,
        content: 'main',
        placement: 'bottom',
        disableBeacon: true,
      },
    ];
  },
};
