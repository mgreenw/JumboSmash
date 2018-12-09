// @flow

import React from "react";
import { Image, View, Text } from "react-native";
import { Font } from "expo";
import { connect } from "react-redux";
import type { Dispatch } from "redux";
import type { ReduxState, User } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { Colors } from "mobile/styles/colors";
import ProgressBar from "react-native-progress/Bar";
import { loadApp } from "mobile/actions/app/loadApp";
import { loadCandidates } from "mobile/actions/app/loadCandidates";
import { routes } from "mobile/components/Navigation";

type reduxProps = {
  token: ?string,
  appLoaded: boolean,
  loadAppInProgress: boolean,
  user: ?User
};

type navigationProps = {
  navigation: any
};

type dispatchProps = {
  loadApp: (token: string) => void,
  loadCandidates: (token: string) => void
};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): reduxProps {
  return {
    token: reduxState.token,
    appLoaded: reduxState.appLoaded,
    loadAppInProgress: reduxState.inProgress.loadApp,
    user: reduxState.user
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): dispatchProps {
  return {
    loadApp: (token: string) => {
      dispatch(loadApp(token));
    },
    loadCandidates: (token: string) => {
      dispatch(loadCandidates(token));
    }
  };
}

class AppLoadingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
    if (!this.props.token) {
      // TODO: error handling
    } else {
      const token = this.props.token;
      this.props.loadApp(token);
      this.props.loadCandidates(token);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // loadAuth_inProgress WILL always change, whereas utln / token may be the same (null),
    // so we use it for determining if the load occured.
    if (
      this.props.appLoaded &&
      prevProps.loadAppInProgress != this.props.loadAppInProgress
    ) {
      const { navigate } = this.props.navigation;
      if (this.props.user === null) {
        navigate(routes.OnboardingStack, {});
      } else {
        navigate(routes.MainSwitch, {});
      }
    }
  }

  static navigationOptions = ({ navigation }) => ({
    header: null
  });

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
