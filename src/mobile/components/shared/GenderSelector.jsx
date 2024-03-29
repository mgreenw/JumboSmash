// @flow
/* eslint-disable */

import React from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import _ from 'lodash';
import { StyleSheet } from 'react-native';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import type { Genders } from 'mobile/reducers/';
import { Haptic } from 'expo';

type GenderSelectorProps = {
  defaultGenders: Genders,
  onChange: (genders: Genders) => void,
  plural: boolean
};

type GenderSelectorState = {
  genders: Genders
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
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={() => {
          if (Platform.OS === 'ios') {
            Haptic.selection();
          }
          this.props.onPress();
        }}
      >
        <View
          style={{
            /* TODO: get right text style */
            width: 20,
            height: 20,
            borderColor: Colors.AquaMarine,
            borderWidth: 1,
            borderRadius: 20,
            marginBottom: 8,
            paddingLeft: 1,
            paddingTop: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.props.selected
              ? Colors.AquaMarine
              : Colors.White
          }}
        >
          <CustomIcon name="check" size={12} color={Colors.White} />
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
      genders: this.props.defaultGenders
    };
  }

  // Check via a deep comparison equality check if anything has changed in the
  // genders. If so, call the onChange.
  componentDidUpdate(
    prevProps: GenderSelectorProps,
    prevState: GenderSelectorState
  ) {
    if (!_.isEqual(prevState.genders, this.state.genders)) {
      this.props.onChange(this.state.genders);
    }
  }

  render() {
    const { plural } = this.props;
    return (
      <View style={styles.rowContainer}>
        <GenderToggle
          title={plural ? 'Women' : 'Woman'}
          onPress={() => {
            this.setState(prevState => ({
              genders: {
                ...prevState.genders,
                woman: !prevState.genders.woman
              }
            }));
          }}
          selected={this.state.genders.woman}
        />
        <View style={styles.spacer} />
        <GenderToggle
          title={plural ? 'Non-Binary' : 'Non-Binary'}
          onPress={() => {
            this.setState(prevState => ({
              genders: {
                ...prevState.genders,
                nonBinary: !prevState.genders.nonBinary
              }
            }));
          }}
          selected={this.state.genders.nonBinary}
        />
        <View style={styles.spacer} />
        <GenderToggle
          title={plural ? 'Men' : 'Man'}
          onPress={() => {
            this.setState(prevState => ({
              genders: {
                ...prevState.genders,
                man: !prevState.genders.man
              }
            }));
          }}
          selected={this.state.genders.man}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row'
  },
  spacer: {
    width: 10
  }
});
