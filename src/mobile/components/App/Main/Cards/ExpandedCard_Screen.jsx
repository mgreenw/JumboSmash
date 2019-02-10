// @flow

import React from 'react';
import { View, StatusBar } from 'react-native';
import CardView from 'mobile/components/shared/CardView';

type navigationProps = {
  navigation: any,
};

type Props = navigationProps;

export default (props: Props) => {
  const { navigation } = props;
  const profile = navigation.getParam('profile', null);
  const onMinimize = navigation.getParam('onMinimize', null);
  const token = navigation.getParam('token', null);
  if (profile === null) {
    throw new Error(
      'Error: Navigation Param of Profile is null in Expanded Card Screen',
    );
  }

  if (onMinimize === null) {
    throw new Error(
      'Error: Navigation Param of OnMinimize is null in Expanded Card Screen',
    );
  }
  if (token === null) {
    throw new Error(
      'Error: Navigation Param of token is null in Expanded Card Screen',
    );
  }
  return (
    <View style={{ display: 'flex', flex: 1 }}>
      <StatusBar hidden />
      <CardView profile={profile} onMinimize={onMinimize} token={token} />
    </View>
  );
};
