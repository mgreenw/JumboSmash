// @flow
import React from "react";
import { Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import { styles } from "../../styles/template";
import type { Dispatch } from "redux";
import type { ReduxState } from "../../reducers/index";

type Props = {
  navigation: any
};

type State = {
  name: String,
  birthday: Date
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
  }

  _onPress = () => {
    const { navigation } = this.props;
    //TODO: add navigation to next screen
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
          Name & Age
        </Text>
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
)(NameAgeScreen);
