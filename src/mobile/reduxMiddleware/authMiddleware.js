// @flow

import type { Action } from 'mobile/reducers/index';
import type {
  Terminated_Action,
  Unauthorized_Action
} from 'mobile/actions/apiErrorHandler';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { summonPopup as summonPopupAction } from 'mobile/actions/popup';

const authMiddleware = ({ dispatch }: any) => (next: any) => (
  action: Action | Terminated_Action | Unauthorized_Action
) => {
  const result = next(action);
  // only a partial switch -- this allows us to perform flow case analysis
  // on the payload types, without having to exhaust all action types!
  switch (action.type) {
    case 'UNAUTHORIZED': {
      const { type } = action;
      dispatch(summonPopupAction(type));
      NavigationService.reset();
      break;
    }
    case 'TERMINATED': {
      const { isUnder18 } = action.payload;
      NavigationService.terminate(isUnder18);
      break;
    }
    default: {
      break;
    }
  }
  return result;
};

export default authMiddleware;
