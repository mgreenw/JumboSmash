// @flow
import React from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { Button, Icon, Input } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import AddPhotos from "mobile/components/shared/AddPhotos";
import { styles } from "mobile/styles/template";

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

class OnboardingAddPicturesScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _onPressContinue = () => {
    //TODO: Navigate to next page
    this.props.navigation.navigate("OnboardingNotifications");
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            height: Dimensions.get("window").width
          }}
        >
          <AddPhotos />
        </View>
        <Button
          onPress={this._onPressContinue}
          title="Continue"
          buttonStyle={styles.button}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingAddPicturesScreen);
