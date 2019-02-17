// @flow

import React from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import type { ReduxState, Match, Dispatch } from 'mobile/reducers/index';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import { textStyles } from 'mobile/styles/textStyles';
import getMatchesAction from 'mobile/actions/app/getMatches';
import NewMatchesList from 'mobile/components/shared/NewMatchesList';
import Avatar from 'mobile/components/shared/Avatar';
import type { NavigationScreenProp } from 'react-navigation';
import { routes } from 'mobile/components/Navigation';

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type ReduxProps = {
  matches: ?(Match[]),
  getMatchesInProgress: boolean
};

type DispatchProps = {
  getMatches: () => void
};

type Props = ReduxProps & NavigationProps & DispatchProps;

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  return {
    matches: reduxState.matches,
    getMatchesInProgress: reduxState.inProgress.getMatches
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    getMatches: () => {
      dispatch(getMatchesAction());
    }
  };
}

class MessagingScreen extends React.Component<Props> {
  // return a render list function so we can display this IN the flatlist
  renderGenesisText = (hasNewMatches: boolean) => () => {
    return (
      <View
        style={{
          width: '100%',
          marginHorizontal: 5,
          paddingHorizontal: 15,
          marginVertical: 20
        }}
      >
        <Text style={textStyles.headline5Style}>
          {hasNewMatches
            ? 'Why so shy? Click on a match to start chatting!'
            : 'No matches, no messages! Get swiping to start sliding into those dm’s.'}
        </Text>
      </View>
    );
  };

  keyExtractor = (item: Match, index: number) => `${index}`;

  renderMatchListItem = ({ item: match }: { item: Match }) => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        style={{ height: 90, width: '100%', paddingHorizontal: 15 }}
        onPress={() => {
          navigation.navigate(routes.Message, { match });
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginVertical: 11,
            alignItems: 'center'
          }}
        >
          <Avatar size="Small" rounded photoId={6} onPress={() => {}} />
          <View
            style={{
              flex: 1,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              paddingHorizontal: 15
            }}
          >
            <Text style={textStyles.body1Style}>
              {match.profile.fields.displayName}
            </Text>
            <Text
              numberOfLines={2}
              style={[textStyles.subtitle1Style, { flex: 1 }]}
            >
              Lorem ipsum dolor sit amet, adipiscing elit. Aenean commodo ligula
              eget dolor.
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              height: '100%'
            }}
          >
            <Text style={[textStyles.body2Style, { textAlign: 'right' }]}>
              {'foo'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { getMatchesInProgress, getMatches, matches } = this.props;
    const refreshComponent = (
      <RefreshControl
        refreshing={getMatchesInProgress}
        onRefresh={getMatches}
      />
    );

    return (
      <Transition inline appear="right">
        <View style={{ flex: 1 }}>
          <GEMHeader title="Messages" leftIconName="cards" borderBottom />
          <View style={{ flex: 1 }}>
            <FlatList
              ListHeaderComponent={<NewMatchesList matches={matches} />}
              data={matches || [1]}
              keyExtractor={this.keyExtractor}
              renderItem={
                matches
                  ? this.renderMatchListItem
                  : this.renderGenesisText(false)
              }
              refreshControl={refreshComponent}
            />
          </View>
        </View>
      </Transition>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingScreen);
