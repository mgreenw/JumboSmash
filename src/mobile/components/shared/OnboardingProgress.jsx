// @flow

import React from 'react';
import { View } from 'react-native';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { Colors } from 'mobile/styles/colors';

type Props = {
  progress: number,
  maxProgress: number
};

const ProgressConnector = (props: { filled: boolean }) => {
  const { filled } = props;
  return (
    <View
      style={{
        width: 20,
        height: 32,
        justifyContent: 'center'
      }}
    >
      <View
        style={{
          width: '100%',
          height: 2,
          backgroundColor: filled ? Colors.AquaMarine : Colors.White
        }}
      />
    </View>
  );
};

const ProgressTick = (props: { filled: boolean }) => {
  const { filled } = props;
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderColor: Colors.AquaMarine,
        borderWidth: 2,
        borderRadius: 32,
        paddingTop: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: filled ? Colors.AquaMarine : Colors.White
      }}
    />
  );
};

export default class OnboardingProgress extends React.Component<Props> {
  _renderTicks = (progress: number, max: number) => {
    const Ticks = [];
    const numTicks = progress + 1;
    for (let i = 0; i < max; i += 1) {
      const index = i;
      const filled = numTicks > index;
      Ticks.push(<ProgressTick filled={filled} key={`tick_${i}`} />);
      Ticks.push(
        <ProgressConnector
          filled={filled && index !== progress}
          key={`connector_${i}`}
        />
      );
    }
    Ticks.push(<ProgressTick filled={numTicks === max + 1} key="tick_last" />);
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
          alignItems: 'center'
        }}
      >
        {this._renderTicks(progress, maxProgress)}
      </View>
    );
  }
}
