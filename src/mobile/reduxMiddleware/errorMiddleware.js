// @flow
import type { Action } from "mobile/reducers/index";
import NavigationService from "mobile/NavigationService";
import { SPLASH_ROUTE } from "mobile/components/Navigation";

const errorMiddleware = (store: any) => (next: any) => (action: Action) => {
  let result = next(action);
  const { type } = action;
  if (type === "SERVER_ERROR") {
    throw "Sorry, server error occured. Later, we'll catch these nicely. For now, restart the app!";
  }
  return result;
};

export { errorMiddleware };
