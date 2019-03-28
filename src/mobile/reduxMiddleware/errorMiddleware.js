// @flow

import type { Action } from 'mobile/reducers/index';
import { summonPopup as summonPopupAction } from 'mobile/actions/popup';

const errorMiddleware = ({ dispatch }: any) => (next: any) => (
  action: Action
) => {
  const result = next(action);
  const { type } = action;
  if (type === 'SERVER_ERROR') {
    dispatch(summonPopupAction(type));
  }
  return result;
};

export default errorMiddleware;
