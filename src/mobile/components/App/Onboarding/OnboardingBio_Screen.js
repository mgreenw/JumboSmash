// @flow
import React from "react";
import { Text, View, TextInput } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import BioInput from "mobile/components/shared/BioInput";
import { styles } from "mobile/styles/template";
import { Colors, Arthur_Styles } from "mobile/styles/Arthur_Styles";
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

  _goToNextPage = () => {
    const { navigation } = this.props;
    //TODO Navigate to next page
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={Arthur_Styles.onboardingHeader}>About Me</Text>
        <BioInput
          placeholder="The real Tony Monaco"
          onChangeText={bio => this.setState({ bio })}
          value={this.state.bio}
        />
        <Button
          onPress={this._goToNextPage}
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
