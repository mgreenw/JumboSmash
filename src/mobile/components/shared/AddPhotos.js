// @flow
import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";

type Props = {};

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class AddPhotos extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const picPlaceholder = (
      <View
        style={{
          flex: 1,
          backgroundColor: "grey",
          margin: 5,
          aspectRatio: 1,
          borderColor: "#38c7cc",
          borderWidth: 2,
          borderStyle: "dashed"
        }}
      />
    );
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          {picPlaceholder}
          {picPlaceholder}
        </View>
        <View style={{ flexDirection: "row" }}>
          {picPlaceholder}
          {picPlaceholder}
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPhotos);
