// @flow
import React from "react";
import { View } from "react-native";
import { Button, CheckBox } from "react-native-elements";
import _ from "lodash";

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
      <View style={{ flexDirection: "row" }}>
        <CheckBox
          center
          title="He"
          iconLeft
          iconType="material"
          checkedIcon="check"
          uncheckedIcon="add"
          checkedColor="black"
          checked={this.state.pronouns.he}
          onPress={() => {
            this.setState(prevState => ({
              pronouns: {
                ...prevState.pronouns,
                he: !prevState.pronouns.he
              }
            }));
          }}
        />
        <CheckBox
          center
          title="She"
          iconLeft
          iconType="material"
          checkedIcon="check"
          uncheckedIcon="add"
          checkedColor="black"
          checked={this.state.pronouns.she}
          onPress={() => {
            this.setState(prevState => ({
              pronouns: {
                ...prevState.pronouns,
                she: !prevState.pronouns.she
              }
            }));
          }}
        />
        <CheckBox
          center
          title="They"
          iconLeft
          iconType="material"
          checkedIcon="check"
          uncheckedIcon="add"
          checkedColor="black"
          checked={this.state.pronouns.they}
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
    );
  }
}
