// @flow

import React from 'react';
import { View, StatusBar } from 'react-native';
import CardView from 'mobile/components/shared/CardView';

type navigationProps = {
  navigation: any
};

type Props = navigationProps;

class Card extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    const user = navigation.getParam('user', null);
    const onMinimize = navigation.getParam('onMinimize', null);
    const token = navigation.getParam('token', null);
    if (user === null) {
      throw new Error(
        'Error: Navigation Param of User is null in Expanded Card Screen',
      );
    }

    if (onMinimize === null) {
      throw new Error(
        'Error: Navigation Param of OnMinimize is null in Expanded Card Screen',
      );
    }
    if (token === null) {
      throw new Error(
        'Error: Navigation Param of tokem is null in Expanded Card Screen',
      );
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ display: 'flex', flex: 1 }}>
        <StatusBar hidden />
        <CardView
          user={navigation.getParam('user')}
          onMinimize={navigation.getParam('onMinimize')}
          token={navigation.getParam('token')}
        />
      </View>
    );
  }
}

export default Card;
