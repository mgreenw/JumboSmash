// @flow

import React from 'react';
import { Image, View, Text, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { Colors } from 'mobile/styles/colors';
import ProgressBar from 'react-native-progress/Bar';
import loadAppAction from 'mobile/actions/app/loadApp';
import routes from 'mobile/components/navigation/routes';
import { Constants } from 'expo';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import NavigationService from '../navigation/NavigationService';

const ArthurIcon = require('../../assets/arthurIcon.png');

type reduxProps = {
  appLoaded: boolean,
  loadAppInProgress: boolean,
  onboardingCompleted: boolean
};

type navigationProps = {
  navigation: any
};

type dispatchProps = {
  loadApp: () => void
};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {};

function mapStateToProps(reduxState: ReduxState): reduxProps {
  return {
    appLoaded: reduxState.appLoaded,
    loadAppInProgress: reduxState.inProgress.loadApp,
    onboardingCompleted: reduxState.onboardingCompleted
  };
}

function mapDispatchToProps(dispatch: Dispatch): dispatchProps {
  return {
    loadApp: () => {
      dispatch(loadAppAction());
    }
  };
}

class AppLoadingScreen extends React.Component<Props, State> {
  componentDidMount() {
    const { loadApp } = this.props;
    loadApp();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      appLoaded,
      loadAppInProgress,
      navigation,
      onboardingCompleted
    } = this.props;
    // loadAuth_inProgress WILL always change, whereas utln / token may be the same (null),
    // so we use it for determining if the load occured.
    if (appLoaded && prevProps.loadAppInProgress !== loadAppInProgress) {
      if (!onboardingCompleted) {
        navigation.navigate(routes.OnboardingStack);
      } else {
        NavigationService.enterApp();
      }
    }
  }

  render() {
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
            />
          </View>
          <Text style={[{ textAlign: 'center' }]}>
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
)(AppLoadingScreen);
