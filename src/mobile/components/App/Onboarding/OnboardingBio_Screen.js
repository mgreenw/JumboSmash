// @flow
import React from "react";
import { Text, View, TextInput } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";

type Props = {
  navigation: any
};

type State = {
  bio: string
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class OnboardingBioScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      bio: ""
    };
  }

  _onPress = () => {
    const { navigation } = this.props;
    //TODO Navigate to next page
  };

  render() {
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 34,
            marginLeft: 22,
            marginRight: 22,
            textAlign: "center"
          }}
        >
          About Me
        </Text>
        <Input
          multiline={true}
          placeholder="The real Tony Monaco"
          onChangeText={bio => this.setState({ bio })}
          value={this.state.bio}
        />
        <Button
          onPress={this._onPress}
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
)(OnboardingBioScreen);
