// @flow

import React from 'react';
import { View } from 'react-native';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { Colors } from 'mobile/styles/colors';

type Props = {
  progress: number,
  progressComplete: boolean,
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
  _renderTicks = (progress: number, max: number, checkCurrent: boolean) => {
    const Ticks = [];
    const numTicks = checkCurrent ? progress + 1 : progress;
    for (let i = 0; i < max; i += 1) {
      const index = i;
      const checked = numTicks > index;
      Ticks.push(<ProgressTick checked={checked} key={`tick_${i}`} />);
      Ticks.push(
        <ProgressConnector checked={checked && index !== progress} key={`connector_${i}`} />,
      );
    }
    Ticks.push(<ProgressTick checked={numTicks === max + 1} key="tick_last" />);
    return Ticks;
  };

  render() {
    const { progress, maxProgress, progressComplete } = this.props;
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {this._renderTicks(progress, maxProgress, progressComplete)}
      </View>
    );
  }
}
