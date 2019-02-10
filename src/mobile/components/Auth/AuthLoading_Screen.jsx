// @flow
/* eslint-disable */

import React from 'react';
import { Image, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Font, Asset } from 'expo';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { loadAuth } from 'mobile/actions/auth/loadAuth';
import type { ReduxState } from 'mobile/reducers/index';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { routes } from 'mobile/components/Navigation';
import DevTesting from 'mobile/utils/DevTesting';

type reduxProps = {
  token: ?string,
  loadAuthInProgress: boolean,
  authLoaded: boolean,
};

type navigationProps = {
  navigation: any,
};

type dispatchProps = {
  loadAuth: void => void,
};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): reduxProps {
  return {
    token: reduxState.token,
    loadAuthInProgress: reduxState.inProgress.loadAuth,
    authLoaded: reduxState.authLoaded,
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props): dispatchProps {
  return {
    loadAuth: () => {
      dispatch(loadAuth());
    },
  };
}

// https://docs.expo.io/versions/v32.0.0/guides/preloading-and-caching-assets/
function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

// This component is the screen we see on initial app startup, as we are
// loading the state of the app / determining if the user is already logged in.
// If the user is logged in, we then navigate to App, otherwise to Auth.
class AuthLoadingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
    this._loadAssets();
  }

  _loadAssets() {
    const fonts = [
      { vegan: require('../../assets/fonts/Vegan-Regular.ttf') },

      {
        SourceSansPro: require('../../assets/fonts/SourceSansPro-Regular.ttf'),
      },
      {
        gemicons: require('../../assets/icons/gemicons.ttf'),
      },
      {
        AvenirNext: require('../../assets/fonts/AvenirNext-Regular.ttf'),
      },
    ];

    const images = [
      require('../../assets/waves/waves1/waves.png'),
      require('../../assets/arthurIcon.png'),
    ];

    const imageAssets = cacheImages(images);
    const fontAssets = cacheFonts(fonts);

    Promise.all([...imageAssets, ...fontAssets])
      .then(results => {
        this.props.loadAuth();
      })
      .catch(e => {
        DevTesting.log('Error importing fonts:', e);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    const { navigate } = this.props.navigation;
    const { token, authLoaded, loadAuthInProgress } = this.props;

    // loadAuth_inProgress WILL always change, whereas utln / token may be the same (null),
    // so we use it for determining if the load occured.
    if (authLoaded && prevProps.loadAuthInProgress != loadAuthInProgress) {
      if (token) {
        navigate(routes.AppSwitch, {});
      } else {
        navigate(routes.LoginStack);
      }
    }
  }

  render() {
    return (
      <View style={Arthur_Styles.container}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 1 }}>
          <Image
            resizeMode="contain"
            style={{
              flex: 1,
              width: null,
              height: null,
            }}
            source={require('../../assets/arthurIcon.png')} // TODO: investigate why  mobile/ does not work
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthLoadingScreen);
