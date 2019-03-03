// @flow

import type { Action } from 'mobile/reducers/index';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { summonPopup as summonPopupAction } from 'mobile/actions/popup';

const tokenMiddleware = ({ dispatch }: any) => (next: any) => (
  action: Action
) => {
  const result = next(action);
  const { type } = action;
  if (type === 'UNAUTHORIZED') {
    dispatch(summonPopupAction(type));
    NavigationService.reset();
  }
  return result;
};

export default tokenMiddleware;
