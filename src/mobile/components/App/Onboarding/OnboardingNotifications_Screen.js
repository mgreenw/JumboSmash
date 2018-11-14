// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";

type Props = {
  navigation: any
};

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class OnboardingNotificationsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  _enableNotifications = () => {
    //TODO: enable notifications
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate("AppLoading");
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Push Notifications</Text>
        <Text
          style={{
            fontSize: 34,
            marginLeft: 22,
            marginRight: 22,
            textAlign: "center"
          }}
        >
          We use push notifications to let you know when you have a new match or
          message.
        </Text>

        <Button
          onPress={this._enableNotifications}
          title="Enable"
          buttonStyle={styles.button}
        />
        <Text onPress={this._goToNextPage}>Skip</Text>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingNotificationsScreen);
