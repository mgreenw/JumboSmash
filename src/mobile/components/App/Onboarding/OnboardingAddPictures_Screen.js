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
import { styles } from "mobile/styles/template";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = {
  navigation: any
};

type State = {
  photos: array
};

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

  _onAddPhoto = () => {
    console.log("pressed add photo");
  };

  _onPressContinue = () => {
    console.log("pressed continue");
  };

  render() {
    const spacer = (
      <View style={{ width: "100%", height: 25, backgroundColor: "#38c7cc" }} />
    );
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
    let renderedPhotos;
    if (!this.state.photos) {
      renderedPhotos = (
        <Button
          onPress={this._onAddPhoto}
          title="Upload photos"
          buttonStyle={styles.button}
        />
      )
    } else {
      renderedPhotos = (
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").width
          }}
        >
          <View style={{ flex: 1, padding: 10 }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              {picPlaceholder}
              {picPlaceholder}
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              {picPlaceholder}
              {picPlaceholder}
            </View>
          </View>
        </View>
        {spacer}
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").width,
            backgroundColor: "#f0f3f5"
          }}
        />
      )
    }
    return (
      <View style={styles.container}>
      {renderedPhotos}
        
        <Button
          onPress={this._onAddPhoto}
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
