// @flow

import React from 'react';
import { Image, View, Text, SafeAreaView } from 'react-native';
import { Font, Asset, Constants, SplashScreen, AppLoading } from 'expo';
import { connect } from 'react-redux';
import loadAuthAction from 'mobile/actions/auth/loadAuth';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import routes from 'mobile/components/navigation/routes';
import Sentry from 'sentry-expo';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import loadAppAction from 'mobile/actions/app/loadApp';
import ProgressBar from 'react-native-progress/Bar';
import { Colors } from 'mobile/styles/colors';
import { CityIconsList } from 'mobile/assets/icons/locations/';
import { randomLoadingStatement } from 'mobile/data/Copy';
import { textStyles } from 'mobile/styles/textStyles';
import * as Animatable from 'react-native-animatable';
import NavigationService from '../navigation/NavigationService';

// pre fonts for the inital text:
const VeganStyle = require('../../assets/fonts/Vegan-Regular.ttf');
const SourceSansPro_Regular = require('../../assets/fonts/SourceSansPro-Regular.ttf');

const ArthurIcon = require('../../assets/arthurIcon.png');

const ArthurLoadingGif = require('../../assets/arthurLoading.gif');
const ArthurLoadingFrame1 = require('../../assets/arthurLoadingFrame1.png');
const Waves1 = require('../../assets/waves/waves1/waves.png');
const WavesFullScreen = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');
const WavesFullScreen2 = require('../../assets/waves/wavesFullScreen/wavesFullScreen2.png');

type ReduxProps = {
  token: ?string,
  loadAuthInProgress: boolean,
  authLoaded: boolean,
  appLoaded: boolean,
  loadAppInProgress: boolean,
  onboardingCompleted: boolean
};

type NavigationProps = {
  navigation: any
};

type DispatchProps = {
  loadAuth: () => void,
  loadApp: () => void
};

type Props = ReduxProps & NavigationProps & DispatchProps;
type State = {
  isReady: boolean,
  loadingStatement: string
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  return {
    token: reduxState.token,
    loadAuthInProgress: reduxState.inProgress.loadAuth,
    authLoaded: reduxState.authLoaded,
    appLoaded: reduxState.appLoaded,
    loadAppInProgress: reduxState.inProgress.loadApp,
    onboardingCompleted: reduxState.onboardingCompleted
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    loadAuth: () => {
      dispatch(loadAuthAction());
    },
    loadApp: () => {
      dispatch(loadAppAction());
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

/**
 * Light weight load -- the bare minimum we need to show the real loading screen.
 */
async function loadAssetsForLoadingScreenAsync() {
  const fonts = [{ VeganStyle, SourceSansPro_Regular }];
  const images = [ArthurIcon];
  const imageAssets = cacheImages(images);
  const fontAssets = cacheFonts(fonts);

  return Promise.all([...imageAssets, ...fontAssets]);
}

// This component is the screen we see on initial app startup, as we are
// loading the state of the app / determining if the user is already logged in.
// If the user is logged in, we then navigate to App, otherwise to Auth.
class AuthLoadingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isReady: false,
      loadingStatement: randomLoadingStatement()
    };
  }

  componentDidMount() {
    SplashScreen.preventAutoHide();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      token,
      authLoaded,
      loadAuthInProgress,
      loadApp,
      navigation,
      appLoaded,
      loadAppInProgress,
      onboardingCompleted
    } = this.props;

    // loadAuth_inProgress WILL always change, whereas utln / token may be the same (null),
    // so we use it for determining if the load occured.
    if (authLoaded && prevProps.loadAuthInProgress !== loadAuthInProgress) {
      if (token) {
        loadApp();
      } else {
        navigation.navigate(routes.LoginStack);
      }
    }

    if (appLoaded && prevProps.loadAppInProgress !== loadAppInProgress) {
      if (!onboardingCompleted) {
        navigation.navigate(routes.OnboardingStack);
      } else {
        NavigationService.enterApp();
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
      WavesFullScreen,
      WavesFullScreen2,
      ArthurLoadingFrame1,
      ArthurLoadingGif,
      ...CityIconsList
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
      });
  }

  animateLoadingTextEntrance = () =>
    this.animLoadingTextView.fadeInLeft(1000).then();

  handleViewRef = ref => (this.animLoadingTextView = ref);

  animLoadingTextView: any;

  render() {
    const { isReady, loadingStatement } = this.state;
    if (!isReady) {
      return (
        <AppLoading
          startAsync={loadAssetsForLoadingScreenAsync}
          onFinish={() => {
            this.setState({ isReady: true });
            this._loadAssets();
          }}
          onError={err => {
            Sentry.captureException(err);
          }}
          autoHideSplash={false}
        />
      );
    }

    return (
      <View style={Arthur_Styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={Arthur_Styles.title}>JumboSmash</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Image
              resizeMode="contain"
              style={{
                flex: 1,
                width: null,
                height: null
              }}
              onLoadEnd={() => {
                setTimeout(() => {
                  this.animateLoadingTextEntrance();
                  SplashScreen.hide();
                }, 50);
              }}
              source={ArthurIcon}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'stretch',
              paddingLeft: 60,
              paddingRight: 60
            }}
          >
            <ProgressBar
              progress={0.3}
              height={10}
              unfilledColor={Colors.IceBlue}
              borderWidth={0}
              color={Colors.Grapefruit}
              indeterminate
              borderRadius={6}
              width={null}
              useNativeDriver
            />
            <Animatable.View ref={this.handleViewRef} useNativeDriver>
              <Text
                style={[
                  textStyles.body1Style,
                  {
                    textAlign: 'center',
                    color: Colors.Black,
                    padding: 15
                  }
                ]}
              >
                {loadingStatement}
              </Text>
            </Animatable.View>
          </View>
          <Text style={[textStyles.body1Style, { textAlign: 'center' }]}>
            {`Version ${Constants.manifest.version}`}
          </Text>
        </SafeAreaView>
        <AndroidBackHandler onBackPress={() => true} />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreen);
