// @flow

import React from 'react';
import { View, Text } from 'react-native';
import GEMHeader from 'mobile/components/shared/Header';
import NavigationService from 'mobile/components/navigation/NavigationService';
import routes from 'mobile/components/navigation/routes';

type Props = {};

/* eslint-disable-next-line no-unused-vars */
const YackListScreen = (props: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <GEMHeader
        title="JumboYak"
        rightIcon={{
          name: 'cards',
          onPress: () => {
            NavigationService.navigate(routes.Cards);
          }
        }}
        leftIcon={{
          name: 'user',
          onPress: () => {
            NavigationService.navigate(routes.Profile);
          }
        }}
        centerComponent={<Text>JumboYak</Text>}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>list screen</Text>
      </View>
    </View>
  );
};

export default YackListScreen;
