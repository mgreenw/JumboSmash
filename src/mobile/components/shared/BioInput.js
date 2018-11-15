// @flow
import React from "react";
import { Text, View } from "react-native";
import { Input } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";

type Props = {
  placeholder: string,
  value: string,
  onChangeText: (bio: string) => void
};

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class OnboardingBioScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Input
        multiline={true}
        placeholder={this.props.placeholder}
        onChangeText={bio => this.props.onChangeText(bio)}
        value={this.props.value}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingBioScreen);
