// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "../../styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../reducers/index";

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

  _onPress = () => {
    const { navigation } = this.props;
    navigation.navigate("OnboardingNameAge");
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Project GEM</Text>
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

        <Button
          onPress={this._onPress}
          title="Roll 'Bos"
          buttonStyle={styles.button}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingStartScreen);
