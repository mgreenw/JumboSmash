// @flow
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import CustomIcon from "mobile/assets/icons/CustomIcon";
import _ from "lodash";
import { StyleSheet } from "react-native";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import { textStyles } from "mobile/styles/textStyles";
import { Colors } from "mobile/styles/colors";
import type { Pronouns } from "mobile/reducers/";

type GenderSelectorProps = {
  defaultPronouns: Pronouns,
  onChange: (pronouns: Pronouns) => void,
  plural: boolean
};

type GenderSelectorState = {
  pronouns: Pronouns
};

type GenderToggleProps = {
  title: string,
  onPress: () => void,
  selected: boolean
};
type GenderToggleState = {};

class GenderToggle extends React.Component<
  GenderToggleProps,
  GenderToggleState
> {
  render() {
    return (
      <TouchableOpacity
        style={{
          borderRadius: 5,
          borderWidth: 1,
          padding: 8,
          borderColor: Colors.AquaMarine,
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={this.props.onPress}
      >
        // TODO: get right text style
        <View
          style={{
            width: 20,
            height: 20,
            borderColor: Colors.AquaMarine,
            borderWidth: 1,
            borderRadius: 20,
            marginBottom: 8,
            paddingLeft: 1,
            paddingTop: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: this.props.selected
              ? Colors.AquaMarine
              : Colors.White
          }}
        >
          <CustomIcon name={"check"} size={12} color={Colors.White} />
        </View>
        <Text style={textStyles.subtitle2Style}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

export class GenderSelector extends React.Component<
  GenderSelectorProps,
  GenderSelectorState
> {
  constructor(props: GenderSelectorProps) {
    super(props);
    this.state = {
      pronouns: this.props.defaultPronouns
    };
  }

  // Check via a deep comparison equality check if anything has changed in the
  // pronouns. If so, call the onChange.
  componentDidUpdate(
    prevProps: GenderSelectorProps,
    prevState: GenderSelectorState
  ) {
    if (!_.isEqual(prevState.pronouns, this.state.pronouns)) {
      this.props.onChange(this.state.pronouns);
    }
  }

  render() {
    const { plural } = this.props;
    return (
      <View style={styles.rowContainer}>
        <GenderToggle
          title={plural ? "Women" : "Woman"}
          onPress={() => {
            this.setState(prevState => ({
              pronouns: {
                ...prevState.pronouns,
                she: !prevState.pronouns.she
              }
            }));
          }}
          selected={this.state.pronouns.she}
        />
        <View style={styles.spacer} />
        <GenderToggle
          title={plural ? "Non-Binary" : "Non-Binary"}
          onPress={() => {
            this.setState(prevState => ({
              pronouns: {
                ...prevState.pronouns,
                they: !prevState.pronouns.they
              }
            }));
          }}
          selected={this.state.pronouns.they}
        />
        <View style={styles.spacer} />
        <GenderToggle
          title={plural ? "Men" : "Man"}
          onPress={() => {
            this.setState(prevState => ({
              pronouns: {
                ...prevState.pronouns,
                he: !prevState.pronouns.he
              }
            }));
          }}
          selected={this.state.pronouns.he}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row"
  },
  spacer: {
    width: 10
  }
});
