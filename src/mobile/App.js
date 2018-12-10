// @flow

import React from "react";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createRootNavigator } from "./components/Navigation";
import rootReducer from "./reducers";
import NavigationService from "./NavigationService";
import { createAppContainer } from "@react-navigation/native";

const store = createStore(rootReducer, applyMiddleware(thunk));
const TopLevelNavigator = createRootNavigator();
const AppContainer = createAppContainer(TopLevelNavigator);

type Props = {};
type State = {};
export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Provider>
    );
  }
}
