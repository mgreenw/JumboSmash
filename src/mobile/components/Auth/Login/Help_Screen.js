// @flow
import React from "react";
import { Text, View, Image } from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/auth";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { routes } from "mobile/components/Navigation";

type Props = {
  navigation: any
};

type State = {
  prevRoute: ?string
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class HelpScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // Get last page we visited
    let prevRoute = null;
    const parent = props.navigation.dangerouslyGetParent();

    if (parent && parent.state.routes) {
      const sizeStack = parent.state.routes.length;
      if (sizeStack >= 2) {
        prevRoute = parent.state.routes[sizeStack - 2].routeName;
      }
    }

    this.state = {
      prevRoute: prevRoute
    };
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = {
    headerStyle: {
      borderBottomWidth: 0
    }
  };

  // @flow
  renderHelpMessage(prevRoute: ?string) {
    if (prevRoute == routes.Splash) {
      return "Splash page help message";
    } else if (prevRoute == routes.Verify) {
      return "Verify page help message";
    } else if (prevRoute == routes.Not2019) {
      return "Not2019 page help message";
    } else if (prevRoute == routes.ExpiredCode) {
      return "Expired code page help message";
    } else {
      return "Generic Help screen if it doesn't fit any of the auth pages";
    }
  }

  render() {
    return (
      <View style={Arthur_Styles.container}>
        <Text style={styles.title}>
          {"HELP: " + this.renderHelpMessage(this.state.prevRoute)}
        </Text>
        <Image
          resizeMode="stretch"
          source={require("../../../assets/waves/waves1/waves.png")}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "100%"
          }}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpScreen);
