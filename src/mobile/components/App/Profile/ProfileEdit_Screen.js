// @flow
import React from "react";
import { Dimensions, Text, View, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Button, Icon, Input } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../../reducers/index";
import { styles } from "../../../styles/auth";

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

class SettingsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = ({ navigation }) => ({
    headerLeft: navigation.state.params.headerLeft,
    title: "Edit Profile"
  });

  // for refs
  nameInput: Input;

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
    return (
      <ScrollView>
        {spacer}
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
            />
          </View>
        </View>
        {spacer}
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").width,
            backgroundColor: "#f0f3f5"
          }}
        >
          <Input
            containerStyle={styles.inputWrapperStyle}
            placeholderTextColor={"#DDDDDD"}
            inputStyle={{ color: "#222222" }}
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            label="Tufts UTLN"
            placeholder="amonac01"
            onChangeText={() => {}}
            ref={input => (this.nameInput = input)}
            errorMessage={""}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        {spacer}
      </ScrollView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
