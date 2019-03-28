// @flow
import { NavigationActions } from 'react-navigation';
import type { Scene } from 'mobile/reducers';
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
      throw new Error(
        'called navigateToCards with scene `stone`, but stone not yet implemented'
      );
    }
    default: {
      // eslint-disable-next-line no-unused-expressions
      (scene: empty); // ensures we have handled all cases
    }
  }
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
  navigateToCards,
  reset
};
