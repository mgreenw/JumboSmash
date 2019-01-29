// @flow

import React from "react";
import { Image, View, Text } from "react-native";
import { Font } from "expo";
import { connect } from "react-redux";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { Colors } from "mobile/styles/colors";
import ProgressBar from "react-native-progress/Bar";
import { loadApp } from "mobile/actions/app/loadApp";
import { routes } from "mobile/components/Navigation";

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

function mapStateToProps(reduxState: ReduxState, ownProps: Props): reduxProps {
  return {
    appLoaded: reduxState.appLoaded,
    loadAppInProgress: reduxState.inProgress.loadApp,
    onboardingCompleted: reduxState.onboardingCompleted
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): dispatchProps {
  return {
    loadApp: () => {
      dispatch(loadApp());
    }
  };
}

class AppLoadingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
    this.props.loadApp();
  }

  componentDidUpdate(prevProps, prevState) {
    // loadAuth_inProgress WILL always change, whereas utln / token may be the same (null),
    // so we use it for determining if the load occured.
    if (
      this.props.appLoaded &&
      prevProps.loadAppInProgress != this.props.loadAppInProgress
    ) {
      const { navigate } = this.props.navigation;
      if (!this.props.onboardingCompleted) {
        navigate(routes.OnboardingStack);
      } else {
        navigate(routes.MainSwitch, {});
      }
    }
  }

  render() {
    return (
      <View style={Arthur_Styles.container}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={Arthur_Styles.title}>Project Gem</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Image
            resizeMode="contain"
            style={{
              flex: 1,
              width: null,
              height: null
            }}
            source={require("../../assets/arthurIcon.png")} // TODO: investigate why  mobile/ does not work
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "stretch",
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
            indeterminate={true}
            borderRadius={6}
            width={null}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLoadingScreen);
