// @flow

import React from 'react';
import { Image, View, Text, SafeAreaView } from 'react-native';
import { Font, Asset, Constants } from 'expo';
import { connect } from 'react-redux';
import loadAuthAction from 'mobile/actions/auth/loadAuth';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import routes from 'mobile/components/navigation/routes';
import DevTesting from 'mobile/utils/DevTesting';
import Sentry from 'sentry-expo';

const ArthurIcon = require('../../assets/arthurIcon.png');
const ArthurLoadingGif = require('../../assets/arthurLoading.gif');
const Waves1 = require('../../assets/waves/waves1/waves.png');
const WavesFullSCreen = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type ReduxProps = {
  token: ?string,
  loadAuthInProgress: boolean,
  authLoaded: boolean
};

type NavigationProps = {
  navigation: any
};

type DispatchProps = {
  loadAuth: void => void
};

type Props = ReduxProps & NavigationProps & DispatchProps;
type State = {};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  return {
    token: reduxState.token,
    loadAuthInProgress: reduxState.inProgress.loadAuth,
    authLoaded: reduxState.authLoaded
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    loadAuth: () => {
      dispatch(loadAuthAction());
    }
  };
}

// https://docs.expo.io/versions/v32.0.0/guides/preloading-and-caching-assets/
function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }
    return Asset.fromModule(image).downloadAsync();
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

  componentDidUpdate(prevProps: Props) {
    const { navigation } = this.props;
    const { token, authLoaded, loadAuthInProgress } = this.props;

    // loadAuth_inProgress WILL always change, whereas utln / token may be the same (null),
    // so we use it for determining if the load occured.
    if (authLoaded && prevProps.loadAuthInProgress !== loadAuthInProgress) {
      if (token) {
        navigation.navigate(routes.AppSwitch, {});
      } else {
        navigation.navigate(routes.LoginStack);
      }
    }
  }

  /* eslint-disable */
  _loadAssets() {
    const fonts = [
      { VeganStyle: require('../../assets/fonts/Vegan-Regular.ttf') },
      {
        AvenirNext_Regular: require('../../assets/fonts/AvenirNext-Regular.ttf')
      },
      {
        AvenirNext_DemiBold: require('../../assets/fonts/AvenirNext-DemiBold.ttf')
      },
      {
        SourceSansPro_Regular: require('../../assets/fonts/SourceSansPro-Regular.ttf')
      },
      {
        SourceSansPro_Bold: require('../../assets/fonts/SourceSansPro-Bold.ttf')
      },
      {
        SourceSansPro_DemiBold: require('../../assets/fonts/SourceSansPro-SemiBold.ttf')
      },

      { gemicons: require('../../assets/icons/gemicons.ttf') },
      { AvenirNext: require('../../assets/fonts/AvenirNext-Regular.ttf') }
    ];
    /* eslint-enable */

    const images = [
      Waves1,
      ArthurIcon,
      WavesFullSCreen,
      // ArthurLoadingImage,
      ArthurLoadingGif
    ];

    const imageAssets = cacheImages(images);
    const fontAssets = cacheFonts(fonts);

    Promise.all([...imageAssets, ...fontAssets])
      .then(() => {
        const { loadAuth } = this.props;
        loadAuth();
      })
      .catch(e => {
        Sentry.captureException(e);

        DevTesting.log('Error importing fonts:', e);
      });
  }

  render() {
    return (
      <View style={Arthur_Styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <Image
              resizeMode="contain"
              style={{
                flex: 1,
                width: null,
                height: null
              }}
              source={ArthurIcon} // TODO: investigate why  mobile/ does not work
            />
          </View>
          <View style={{ flex: 1 }} />
          <Text style={[{ textAlign: 'center' }]}>
            {`Version ${Constants.manifest.version}`}
          </Text>
        </SafeAreaView>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreen);
