// @flow

import React from 'react';
import { View, StatusBar } from 'react-native';
import CardView from 'mobile/components/shared/CardView';
import { isIphoneX } from 'mobile/utils/Platform';

type navigationProps = {
  navigation: any
};

type Props = navigationProps;

export default (props: Props) => {
  const { navigation } = props;
  const profile = navigation.getParam('profile', null);
  const onMinimize = navigation.getParam('onMinimize', null);
  const swipeButtons = navigation.getParam('swipeButtons', null);
  if (profile === null) {
    throw new Error(
      'Error: Navigation Param of Profile is null in Expanded Card Screen'
    );
  }

  if (onMinimize === null) {
    throw new Error(
      'Error: Navigation Param of OnMinimize is null in Expanded Card Screen'
    );
  }

  const iphoneX = isIphoneX();

  return (
    <View style={{ display: 'flex', flex: 1 }}>
      <StatusBar hidden={!iphoneX} />
      {iphoneX && <View style={{ height: 40, backgroundColor: '#fff' }} />}

      <CardView
        profile={profile}
        onMinimize={onMinimize}
        swipeButtons={swipeButtons}
      />
      {swipeButtons}
    </View>
  );
};
