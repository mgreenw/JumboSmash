// @flow
import React from "react";
import { View } from "react-native";
import { Button, CheckBox } from "react-native-elements";
import _ from "lodash";
import { StyleSheet } from "react-native";

export type Pronouns = {
  he: boolean,
  she: boolean,
  they: boolean
};

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
    if (_.isEqual(prevState.pronouns, this.state.pronouns)) {
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
            checkedColor={IceBlue}
            uncheckedColor={Black}
            checked={this.state.pronouns.she}
            containerStyle={
              this.state.pronouns.she
                ? styles.checkBoxContainer_checked
                : styles.checkBoxContainer_unchecked
            }
            textStyle={
              this.state.pronouns.she
                ? styles.checkBoxText_checked
                : styles.checkBoxText_unchecked
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
            checkedColor={IceBlue}
            uncheckedColor={Black}
            checked={this.state.pronouns.they}
            containerStyle={
              this.state.pronouns.they
                ? styles.checkBoxContainer_checked
                : styles.checkBoxContainer_unchecked
            }
            textStyle={
              this.state.pronouns.they
                ? styles.checkBoxText_checked
                : styles.checkBoxText_unchecked
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
            checkedColor={IceBlue}
            uncheckedColor={Black}
            checked={this.state.pronouns.he}
            containerStyle={
              this.state.pronouns.he
                ? styles.checkBoxContainer_checked
                : styles.checkBoxContainer_unchecked
            }
            textStyle={
              this.state.pronouns.he
                ? styles.checkBoxText_checked
                : styles.checkBoxText_unchecked
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
const IceBlue = "#f0f3f5";
const Black = "#363535";
const AquaMarine = "#38c7cc";
const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row"
  },
  checkBoxWrapper: {
    flex: 1,
    alignItems: "center"
  },
  checkBoxText_unchecked: {
    fontSize: 12,
    marginLeft: 2,
    color: Black
  },
  checkBoxText_checked: {
    fontSize: 12,
    marginLeft: 2,
    color: IceBlue
  },
  checkBoxContainer_checked: {
    width: "100%",
    borderRadius: 30,
    margin: 0,
    backgroundColor: AquaMarine
  },
  checkBoxContainer_unchecked: {
    width: "100%",
    borderRadius: 30,
    margin: 0,
    backgroundColor: IceBlue
  }
});
