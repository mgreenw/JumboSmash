// @flow
import { NavigationActions } from 'react-navigation';
import routes from './routes';

let _navigator;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function navigate(routeName: string, params: any) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

function back() {
  _navigator.dispatch(NavigationActions.back());
}

function reset() {
  navigate(routes.Splash);
}

// add other navigation functions that you need and export them

export default {
  navigate,
  back,
  setTopLevelNavigator,
  reset
};
