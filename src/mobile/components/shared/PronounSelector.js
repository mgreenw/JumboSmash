// @flow
import React from "react";
import { View } from "react-native";
import { Button, CheckBox } from "react-native-elements";
import _ from "lodash";
import { StyleSheet } from "react-native";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { Colors } from "mobile/styles/colors";
import type { Pronouns } from "mobile/reducers/";

type Props = {
  defaultPronouns: Pronouns,
  onChange: (pronouns: Pronouns) => void
};

type State = {
  pronouns: Pronouns
};

export class PronounSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pronouns: this.props.defaultPronouns
    };
  }

  // Check via a deep comparison equality check if anything has changed in the
  // pronouns. If so, call the onChange.
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!_.isEqual(prevState.pronouns, this.state.pronouns)) {
      this.props.onChange(this.state.pronouns);
    }
  }

  render() {
    return (
      <View style={styles.rowContainer}>
        <View style={{ flex: 0.05 }} />
        <View style={styles.checkBoxWrapper}>
          <CheckBox
            title="She-series "
            iconLeft
            iconType="material"
            checkedIcon="check"
            uncheckedIcon="add"
            checkedColor={Colors.IceBlue}
            uncheckedColor={Colors.Black}
            checked={this.state.pronouns.she}
            containerStyle={
              this.state.pronouns.she
                ? Arthur_Styles.checkBoxContainer_checked
                : Arthur_Styles.checkBoxContainer_unchecked
            }
            textStyle={
              this.state.pronouns.she
                ? Arthur_Styles.checkBoxText_checked
                : Arthur_Styles.checkBoxText_unchecked
            }
            onPress={() => {
              this.setState(prevState => ({
                pronouns: {
                  ...prevState.pronouns,
                  she: !prevState.pronouns.she
                }
              }));
            }}
          />
        </View>
        <View style={{ flex: 0.05 }} />
        <View style={styles.checkBoxWrapper}>
          <CheckBox
            title="They-series"
            iconLeft
            iconType="material"
            checkedIcon="check"
            uncheckedIcon="add"
            checkedColor={Colors.IceBlue}
            uncheckedColor={Colors.Black}
            checked={this.state.pronouns.they}
            containerStyle={
              this.state.pronouns.they
                ? Arthur_Styles.checkBoxContainer_checked
                : Arthur_Styles.checkBoxContainer_unchecked
            }
            textStyle={
              this.state.pronouns.they
                ? Arthur_Styles.checkBoxText_checked
                : Arthur_Styles.checkBoxText_unchecked
            }
            onPress={() => {
              this.setState(prevState => ({
                pronouns: {
                  ...prevState.pronouns,
                  they: !prevState.pronouns.they
                }
              }));
            }}
          />
        </View>
        <View style={{ flex: 0.05 }} />
        <View style={styles.checkBoxWrapper}>
          <CheckBox
            title="He-series "
            iconLeft
            iconType="material"
            checkedIcon="check"
            uncheckedIcon="add"
            checkedColor={Colors.IceBlue}
            uncheckedColor={Colors.Black}
            checked={this.state.pronouns.he}
            containerStyle={
              this.state.pronouns.he
                ? Arthur_Styles.checkBoxContainer_checked
                : Arthur_Styles.checkBoxContainer_unchecked
            }
            textStyle={
              this.state.pronouns.he
                ? Arthur_Styles.checkBoxText_checked
                : Arthur_Styles.checkBoxText_unchecked
            }
            onPress={() => {
              this.setState(prevState => ({
                pronouns: {
                  ...prevState.pronouns,
                  he: !prevState.pronouns.he
                }
              }));
            }}
          />
        </View>
        <View style={{ flex: 0.05 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row"
  },
  checkBoxWrapper: {
    flex: 1,
    alignItems: "center"
  }
});
