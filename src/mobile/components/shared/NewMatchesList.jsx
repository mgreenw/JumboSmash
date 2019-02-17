// @flow

import React from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import type { Match } from 'mobile/reducers';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import Avatar, { MediumWidth } from './Avatar';

type Props = {
  matches: ?(Match[])
};

const keyExtractor = (match: Match, index: number) => `${index}`;

export default class extends React.Component<Props> {
  renderMatchListItem = ({ item: match }: { item: Match }) => {
    return (
      <View
        style={{
          flex: 1,
          marginHorizontal: 15,
          borderWidth: 4,
          borderRadius: 100,
          borderColor: Colors.AquaMarine
        }}
      >
        <Avatar
          size="Medium"
          rounded
          photoId={match.profile.photoIds[0]}
          onPress={() => {
            Alert.alert('Hey you pressed me');
          }}
        />
      </View>
    );
  };

  renderGenesisText = () => {
    return (
      <View
        style={{
          height: MediumWidth,
          width: '100%',
          marginHorizontal: 5,
          paddingHorizontal: 15,
          marginVertical: 20
        }}
      >
        <Text style={textStyles.body1Style}>
          {
            'You don’t have any new matches! Here’s where a match will show up once you do. Get swiping!'
          }
        </Text>
      </View>
    );
  };

  render() {
    const { matches } = this.props;
    return (
      <View>
        <View>
          <Text style={[textStyles.subtitle1Style, { paddingLeft: 15 }]}>
            New Matches
          </Text>
          {matches === null || matches === undefined ? (
            this.renderGenesisText()
          ) : (
            <FlatList
              style={{ paddingTop: 12, paddingBottom: 12 }}
              data={matches}
              keyExtractor={keyExtractor}
              renderItem={this.renderMatchListItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              getItemLayout={(data, index) => ({
                length: MediumWidth,
                offset: MediumWidth * index,
                index
              })}
            />
          )}
          <Text style={[textStyles.subtitle1Style, { paddingLeft: 15 }]}>
            Messages
          </Text>
        </View>
      </View>
    );
  }
}
