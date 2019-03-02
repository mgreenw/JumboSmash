// @flow

import type { PopupCode } from 'mobile/reducers';

export type SummonPopup_Action = {
  type: 'SUMMON_POPUP',
  payload: { code: PopupCode },
  meta: {}
};

export type DismissPopup_Action = {
  type: 'DISMISS_POPUP',
  payload: {},
  meta: {}
};

export const summonPopup = (code: PopupCode) => {
  return {
    type: 'SUMMON_POPUP',
    payload: { code },
    meta: {}
  };
};

export const dismissPopup = () => {
  return {
    type: 'DISMISS_POPUP',
    payload: {},
    meta: {}
  };
};
