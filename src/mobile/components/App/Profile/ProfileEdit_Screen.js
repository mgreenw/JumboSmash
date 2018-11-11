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
import type { ReduxState } from "../../../reducers/index";
import { styles } from "../../../styles/template";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = {
  navigation: any
};

type State = {
  displayName: string,
  bio: string
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class SettingsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayName: "", // TODO: load from redux
      bio: ""
    };
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = ({ navigation }) => ({
    headerLeft: navigation.state.params.headerLeft,
    title: "Edit Profile"
  });

  // for refs
  nameInput: Input;
  bioInput: Input;

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
      <KeyboardAwareScrollView extraScrollHeight={30}>
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
          <View style={{ padding: 20 }}>
            <Input
              placeholderTextColor={"#DDDDDD"}
              inputStyle={{ color: "#222222" }}
              labelStyle={styles.labelStyle}
              label="Prefered Name"
              placeholder="Tony Monaco"
              onChangeText={name => {
                this.setState({ displayName: name });
              }}
              ref={input => (this.nameInput = input)}
              errorMessage={""}
              autoCorrect={false}
            />
          </View>
          <View style={{ flex: 1, padding: 20 }}>
            <TextInput
              style={{ flex: 1, borderWidth: 1 }}
              placeholderTextColor={"#DDDDDD"}
              inputStyle={{ color: "#222222" }}
              labelStyle={styles.labelStyle}
              label="About Me"
              placeholder="Dan Katz Dan Katz"
              onChangeText={bio => {
                this.setState({ bio: bio });
              }}
              ref={input => (this.bioInput = input)}
              errorMessage={""}
              autoCorrect={false}
              multiline={true}
            />
          </View>
        </View>
        {spacer}
      </KeyboardAwareScrollView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
