// @flow
import { NavigationActions } from 'react-navigation';
import type { Scene } from 'mobile/reducers';
import store from 'mobile/store';
import routes from './routes';

let _navigator;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function navigate(routeName: string, params?: Object, action?: Object) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
      action
    })
  );
}

// Helper function -- could be more abstracted if routes are split by scenes, but IMO that's overkill.
function navigateToCards(scene: Scene) {
  switch (scene) {
    case 'social': {
      navigate(routes.SocialCards);
      break;
    }

    case 'smash': {
      navigate(routes.SmashCards);
      break;
    }

    case 'stone': {
      navigate(routes.StoneCards);
      break;
    }
    default: {
      // eslint-disable-next-line no-unused-expressions
      (scene: empty); // ensures we have handled all cases
    }
  }
}

/**
 *
 * @param {number} userId
 * attempts to go to the messaging screen for a given userId.
 * If that userId is not in the redux state of matches, navigates instead to the `matches` screen.
 * If on a different message, navigates to the `matches` screen. This is to ensure we reset the message screen.
 * TODO: allow staying on messages screen but changing the messaged person.
 */
function navigateToMatch(userId: number) {
  const { matchesById } = store.getState();
  if (userId in matchesById) {
    const match = matchesById[userId];
    navigate(
      routes.Matches,
      {},
      NavigationActions.navigate({
        routeName: routes.Message,
        params: {
          match
        }
      })
    );
  } else {
    navigate(routes.Matches);
  }
}

function back(key: string) {
  _navigator.dispatch(NavigationActions.back({ key }));
}

function reset() {
  navigate(routes.Splash);
}

/**
 * ONLY USE IN CASES TO PERMENATELY SEND A USER TO THE TERMINATED SCREEN.
 */
function terminate(isUnder18?: boolean = false) {
  navigate(routes.Terminated, { isUnder18 });
}

/**
 * Get the route of the top level screen.
 * See for details:
 * https://github.com/react-navigation/react-navigation/issues/962
 */
function getCurrentRoute(): { routeName: string, params: Object } {
  let route = _navigator.state.nav;
  while (route.routes) {
    route = route.routes[route.index];
  }
  return route;
}

/**
 * Enter app if after launch, otherwise go to the wall screen.
 */
function enterApp() {
  const { launchDate } = store.getState();
  if (!launchDate.status || launchDate.status.wallIsUp) {
    navigate(routes.Prelaunch);
  } else {
    navigate(routes.MainSwitch);
  }
}

export default {
  navigate,
  back,
  setTopLevelNavigator,
  navigateToCards,
  reset,
  terminate,
  getCurrentRoute,
  navigateToMatch,
  enterApp
};
