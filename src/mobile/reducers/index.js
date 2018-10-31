// @flow
import { AsyncStorage } from "react-native";
import _ from "lodash";

// Types:
import { LOGIN_WITH_NEW_TOKEN } from "../actions/auth/login.js";

// TODO: seperate state into profile, meta, API responses, etc.
type State = {
  utln: string,
  loggedIn: boolean,
  token: ?string
};

const defaultState: State = {
  utln: "",
  token: null,
  loggedIn: false
};

export default function rootReducer(state: State = defaultState, action: any) {
  switch (action.type) {
    case LOGIN_WITH_NEW_TOKEN: {
      AsyncStorage.setItem("token", action.token);
      AsyncStorage.setItem("utln", action.utln);

      return _.assign({}, state, {
        utln: action.utln,
        token: action.token,
        loggedIn: true
      });
    }

    default: {
      return state;
    }
  }
}
