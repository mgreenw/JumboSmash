// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
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

class OnboardingStartScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  static navigationOptions = {
    headerLeft: null
  };

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate("OnboardingNameAge");
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={Arthur_Styles.title}>Project Gem</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 34,
              marginLeft: 22,
              marginRight: 22,
              textAlign: "center"
            }}
          >
            {
              "Let's take 2 minutes to get your profile setup before you begin swiping"
            }
          </Text>
        </View>
<<<<<<< HEAD
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <Button
              onPress={this._goToNextPage}
              title="Roll 'Bos"
              buttonStyle={Arthur_Styles.buttonPrimaryActive}
              titleStyle={Arthur_Styles.buttonTitlePrimaryActive}
              disabledStyle={Arthur_Styles.buttonPrimaryDisabled}
            />
          </View>
          <View style={{ flex: 1 }} />
=======
        <View style={{ flex: 1 }}>
          <Button
            onPress={this._onPress}
            title="Roll 'Bos"
            buttonStyle={styles.button}
          />
>>>>>>> a6a06f8c0083710ce85ef723b4f4454596395919
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingStartScreen);
