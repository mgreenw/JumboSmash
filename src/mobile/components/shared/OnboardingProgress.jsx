// @flow

import React from 'react';
import { View } from 'react-native';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { Colors } from 'mobile/styles/colors';

type Props = {
  progress: number,
  maxProgress: number,
};

const ProgressConnector = (props: { checked: boolean }) => {
  const { checked } = props;
  return (
    <View
      style={{
        width: 20,
        height: 32,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: '100%',
          height: 2,
          backgroundColor: checked ? Colors.AquaMarine : Colors.White,
        }}
      />
    </View>
  );
};

const ProgressTick = (props: { checked: boolean }) => {
  const { checked } = props;
  return (
    <View
      style={{
        width: 32,
        height: 32,
        borderColor: Colors.AquaMarine,
        borderWidth: 2,
        borderRadius: 32,
        paddingTop: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: checked ? Colors.AquaMarine : Colors.White,
      }}
    >
      <CustomIcon name="check" size={16} color={Colors.White} />
    </View>
  );
};

export default class OnboardingProgress extends React.Component<Props> {
  _renderTicks = (progress: number, max: number) => {
    const Ticks = [];
    for (let i = 0; i < max; i += 1) {
      const checked = progress > i;
      Ticks.push(<ProgressTick checked={checked} key={`tick_${i}`} />);
      Ticks.push(<ProgressConnector checked={checked} key={`connector_${i}`} />);
    }
    const checked = progress > max;
    Ticks.push(<ProgressTick checked={checked} key="tick_last" />);
    return Ticks;
  };

  render() {
    const { progress, maxProgress } = this.props;
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {this._renderTicks(progress, maxProgress)}
      </View>
    );
  }
}
