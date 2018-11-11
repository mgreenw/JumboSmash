// @flow
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { styles } from "../../styles/auth";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../reducers/index";

type Props = {
  navigation: any
};

type State = {
  help: String
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
    const parent = props.navigation.dangerouslyGetParent();
    const sizeStack = (parent.state.routes).length;
    const lastPage = parent.state.routes[sizeStack-2].routeName;

    this.state = {
      lastPage: lastPage
    };
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = {
    headerStyle: {
      borderBottomWidth: 0
    }
  };

  _onHelpMessage = () => {
    if (this.state.lastPage == "Splash") {
      return "Splash page help message";
    }
    else {
      return "Generic Help screen if it doesn't fit any of the auth pages";
    }
  }

  render() {
    
    return (
      <View style={{ flex: 1, alignSelf: "stretch", width: "100%" }}>
        <Text style={styles.title}>
          {"HELP: " + this._onHelpMessage()}
        </Text>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpScreen);
