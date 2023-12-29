import { ACTIONS, EVENTS, STATUS } from 'react-joyride';

export const isCompleted = (status: string) => status === STATUS.FINISHED;
export const isSkipped = (status: string) => status === STATUS.SKIPPED;
export const isExited = (status: string, action: string) =>
  status === STATUS.SKIPPED || status === STATUS.FINISHED || action === ACTIONS.CLOSE;

export const isNextStep = (type: string) =>
  type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND;
export const isForward = (action: string) => action === ACTIONS.NEXT || action === ACTIONS.START;
export const isBackward = (action: string) => action === ACTIONS.PREV;
export const getNextStepIndex = (index: number, action: string) =>
  index + (action === ACTIONS.PREV ? -1 : 1);
