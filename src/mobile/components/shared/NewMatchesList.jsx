// @flow

import React from 'react';
import { connect } from 'react-redux';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import type { Match, ReduxState, UserProfile } from 'mobile/reducers';
import { textStyles } from 'mobile/styles/textStyles';
import routes from 'mobile/components/navigation/routes';
import NavigationActions from 'mobile/components/navigation/NavigationService';
import Avatar, { MediumWidth } from './Avatar';

type ReduxProps = {|
  unmessagedMatchIds: ?(number[]),
  profileMap: { [userId: number]: UserProfile },
  matchMap: { [userId: number]: Match }
|};

type DispatchProps = {};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  return {
    unmessagedMatchIds: reduxState.unmessagedMatchIds,
    profileMap: reduxState.profiles,
    matchMap: reduxState.matchesById
  };
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

type Props = ReduxProps & DispatchProps;

const keyExtractor = (match: Match, index: number) => `${index}`;

class NewMatchesList extends React.Component<Props> {
  renderMatchListItem = ({ item: userId }: { item: number }) => {
    const { profileMap, matchMap } = this.props;
    const match = matchMap[userId];
    const profile = profileMap[userId];
    return (
      <TouchableOpacity
        onPress={() => {
          NavigationActions.navigate(routes.Message, { match });
        }}
        style={{
          marginHorizontal: 15
        }}
      >
        <Avatar size="Medium" photoId={profile.photoIds[0]} />
      </TouchableOpacity>
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
    const { unmessagedMatchIds } = this.props;
    return (
      <View>
        <View>
          <Text style={[textStyles.subtitle1Style, { paddingLeft: 15 }]}>
            New Matches
          </Text>
          {unmessagedMatchIds === null ||
          unmessagedMatchIds === undefined ||
          unmessagedMatchIds.length === 0 ? (
            this.renderGenesisText()
          ) : (
            <FlatList
              style={{ paddingTop: 12, paddingBottom: 12 }}
              data={unmessagedMatchIds}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewMatchesList);
