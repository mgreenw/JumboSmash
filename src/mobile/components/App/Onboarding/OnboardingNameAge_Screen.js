// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";

type Props = {
  navigation: any
};

type State = {
  name: string,
  birthday: string //TODO: Change to date when we start using a date picker
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class NameAgeScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: "",
      birthday: ""
    };
  }

  _goToNextPage = () => {
    const { navigation } = this.props;
    navigation.navigate("OnboardingMyPronouns");
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={Arthur_Styles.onboardingHeader}>Name & Age</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Input
            placeholderTextColor={"#DDDDDD"}
            inputStyle={{ color: "#222222" }}
            labelStyle={styles.labelStyle}
            label="Name"
            placeholder="Tony Monaco"
            onChangeText={name => this.setState({ name })}
            autoCorrect={false}
          />
          <Input
            placeholderTextColor={"#DDDDDD"}
            inputStyle={{ color: "#222222" }}
            labelStyle={styles.labelStyle}
            label="Birthday"
            placeholder="01/01/97"
            onChangeText={birthday => this.setState({ birthday })}
            autoCorrect={false}
          />
        </View>
<<<<<<< HEAD
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <Button
              onPress={this._goToNextPage}
              title="Continue"
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
            title="Continue"
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
)(NameAgeScreen);
