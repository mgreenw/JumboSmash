// @flow
import { AsyncStorage } from "react-native";
import _ from "lodash";

// Auth:
import { LOGIN_WITH_NEW_TOKEN } from "../actions/auth/login.js";
import { LOGOUT } from "../actions/auth/logout.js";
import {
  LOAD_AUTH__INITIATED,
  LOAD_AUTH__COMPLETED
} from "../actions/auth/loadAuth.js";

// TODO: seperate state into profile, meta, API responses, etc.
type State = {
  utln: string,
  token: ?string,
  loggedIn: boolean,
  loadingAuth: boolean
};

const defaultState: State = {
  utln: "",
  token: null,
  loggedIn: false,
  loadingAuth: false
};

export default function rootReducer(state: State = defaultState, action: any) {
  switch (action.type) {
    // TODO: consider doing these AsyncStorage chunks batched, and with callbacks.
    case LOGIN_WITH_NEW_TOKEN: {
      AsyncStorage.setItem("token", action.token);
      AsyncStorage.setItem("utln", action.utln);

      return _.assign({}, state, {
        utln: action.utln,
        token: action.token,
        loggedIn: true
      });
    }

    case LOGOUT: {
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("utln");

      return _.assign({}, state, {
        utln: "",
        token: null,
        loggedIn: false
      });
    }

    case LOAD_AUTH__INITIATED: {
      return _.assign({}, state, {
        loadingAuth: true
      });
    }

    case LOAD_AUTH__COMPLETED: {
      return _.assign({}, state, {
        utln: action.utln,
        token: action.token,
        loadingAuth: false
      });
    }

    default: {
      return state;
    }
  }
}
