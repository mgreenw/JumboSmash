// @flow
/* eslint-disable */

import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { textStyles } from 'mobile/styles/textStyles';
import { ListItem } from 'react-native-elements';
import { Colors } from 'mobile/styles/colors';
import Avatar from './Avatar';

type Props = {};

export default (props: Props) => {
  const dummyAvatar = (
    <View
      style={{
        flex: 1,
        marginHorizontal: 5,
        borderWidth: 4,
        borderRadius: 100,
        borderColor: Colors.AquaMarine,
      }}
    >
      <Avatar
        size="Medium"
        rounded
        photoId={10}
        onPress={() => {
          Alert.alert('Hey you pressed me');
        }}
      />
    </View>
  );
  return (
    <View>
      <View>
        <Text style={[textStyles.subtitle1Style, { paddingLeft: 15 }]}>New Matches</Text>
        <ScrollView
          style={{ paddingTop: 12, paddingBottom: 12 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {dummyAvatar}
          {dummyAvatar}
          {dummyAvatar}
          {dummyAvatar}
          {dummyAvatar}
          {dummyAvatar}
          {dummyAvatar}
          {dummyAvatar}
          {dummyAvatar}
        </ScrollView>
        <Text style={[textStyles.subtitle1Style, { paddingLeft: 15 }]}>Messages</Text>
      </View>
    </View>
  );
};
