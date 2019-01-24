// @flow
import type { Action } from "mobile/reducers/index";
import NavigationService from "mobile/NavigationService";
import { AsyncStorage } from "react-native";
import { SPLASH_ROUTE } from "mobile/components/Navigation";

const tokenMiddleware = (store: any) => (next: any) => (action: Action) => {
  let result = next(action);

  if (action.type === "UNAUTHORIZED") {
    // AsyncStorage.multiRemove(["token"]).then(stores => {
    //   console.log(stores);
    // });
    NavigationService.navigate(SPLASH_ROUTE, {});
  }
  return result;
};

export { tokenMiddleware };
