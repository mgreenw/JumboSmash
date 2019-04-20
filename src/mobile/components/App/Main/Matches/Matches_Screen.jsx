// @flow

import React from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import type {
  ReduxState,
  Match,
  Dispatch,
  UserProfile,
  ConfirmedMessages
} from 'mobile/reducers/index';
import GEMHeader from 'mobile/components/shared/Header';
import { textStyles } from 'mobile/styles/textStyles';
import getMatchesAction from 'mobile/actions/app/getMatches';
import NewMatchesList from 'mobile/components/shared/NewMatchesList';
import Avatar from 'mobile/components/shared/Avatar';
import type { NavigationScreenProp } from 'react-navigation';
import routes from 'mobile/components/navigation/routes';
import formatTime from 'mobile/utils/time/formattedTimeSince';
import { Colors } from 'mobile/styles/colors';
import { NavigationEvents } from 'react-navigation';
import formatMessage from 'mobile/utils/FormatMessage';

const Seperator = () => {
  return (
    <View
      style={{
        width: '100%',
        height: 2,
        backgroundColor: Colors.IceBlue
      }}
    />
  );
};

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type ReduxProps = {
  matchMap: { [userId: number]: Match },
  profileMap: { [userId: number]: UserProfile },
  conversationMap: { [userId: number]: ConfirmedMessages },
  messagedMatchIds: ?(number[]),
  newMatchIds: ?(number[]),
  getMatchesInProgress: boolean
};

type DispatchProps = {
  getMatches: () => void
};

type Props = ReduxProps & NavigationProps & DispatchProps;

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  return {
    matchMap: reduxState.matchesById,
    profileMap: reduxState.profiles,
    conversationMap: reduxState.confirmedConversations,
    messagedMatchIds: reduxState.messagedMatchIds,
    getMatchesInProgress: reduxState.inProgress.getMatches,
    newMatchIds: reduxState.unmessagedMatchIds
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    getMatches: () => {
      dispatch(getMatchesAction());
    }
  };
}

type State = {
  matchesLoaded: boolean,

  /**
   * Used to determine if we are refreshing matches because the user pullled down on the scrollview.
   * If false, then we don't show the animation (causing the load to occur in the background).
   * Default to false when no refresh occuring.
   */
  refreshManuallyTriggered: boolean
};

class MessagingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      matchesLoaded: false,
      refreshManuallyTriggered: false
    };
  }

  componentDidMount() {
    const { getMatches } = this.props;
    getMatches();
  }

  componentDidUpdate(prevProps: Props) {
    const { getMatchesInProgress } = this.props;
    if (prevProps.getMatchesInProgress && !getMatchesInProgress) {
      // We're doing this safely
      /* eslint-disable-next-line react/no-did-update-set-state */
      this.setState({
        matchesLoaded: true,
        refreshManuallyTriggered: false
      });
    }
  }

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

  keyExtractor = (item: number) => `${item}`;

  renderMatchListItem = ({ item: userId }: { item: number }) => {
    const { navigation, matchMap, profileMap, conversationMap } = this.props;
    const match = matchMap[userId];
    const profile = profileMap[userId];
    const showBadge = match.conversationIsRead === false;
    const mostRecentMessage =
      conversationMap[userId].byId[match.mostRecentMessage];
    const formattedTime = formatTime(mostRecentMessage.timestamp);
    let matchScenes = '';
    if (match.scenes.smash) {
      matchScenes += '🍑';
    }
    if (match.scenes.social) {
      matchScenes += '🐘';
    }

    return (
      <TouchableOpacity
        style={{
          height: 90,
          width: '100%',
          paddingHorizontal: 15,
          backgroundColor: showBadge ? Colors.IceBlue : Colors.White
        }}
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
          <Avatar
            size="Small"
            photoUuid={profile.photoUuids[0]}
            showBadge={showBadge}
            badgeContainerStyle={{ backgroundColor: Colors.IceBlue }}
          />
          <View
            style={{
              flex: 1,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              paddingHorizontal: 15
            }}
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={textStyles.body1Style}>
                {profile.fields.displayName}
              </Text>
              <Text>{matchScenes}</Text>
            </View>
            <Text
              numberOfLines={2}
              style={[
                mostRecentMessage.sender === 'system'
                  ? textStyles.subtitle1StyleSemibold
                  : textStyles.subtitle1Style,
                { flex: 1, color: Colors.Black }
              ]}
            >
              {formatMessage(mostRecentMessage.content, false)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              height: '100%',
              width: 30,
              padding: 0
            }}
          >
            <Text
              style={[
                textStyles.body2Style,
                { textAlign: 'right', padding: 0 }
              ]}
            >
              {formattedTime}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      getMatchesInProgress,
      getMatches,
      messagedMatchIds,
      newMatchIds
    } = this.props;
    const { refreshManuallyTriggered } = this.state;
    const renderGensis = !messagedMatchIds || messagedMatchIds.length === 0;
    const hasNewMatches = !!(newMatchIds && newMatchIds.length > 0);
    const refreshComponent = (
      <RefreshControl
        refreshing={refreshManuallyTriggered}
        onRefresh={() => {
          this.setState({ refreshManuallyTriggered: true }, getMatches);
        }}
      />
    );

    // we need to show one element to actually render the genesis text AS the element
    const data = renderGensis ? [1] : messagedMatchIds;
    const { matchesLoaded } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={() => {
            // onWillFocus calls this during the transition state from previous screen.
            if (!getMatchesInProgress) {
              getMatches();
            }
          }}
        />
        <GEMHeader title="Messages" leftIconName="cards" />
        {matchesLoaded ? (
          <View style={{ flex: 1 }}>
            <FlatList
              ListHeaderComponent={<NewMatchesList />}
              data={data}
              keyExtractor={this.keyExtractor}
              renderItem={
                renderGensis
                  ? this.renderGenesisText(hasNewMatches)
                  : this.renderMatchListItem
              }
              ItemSeparatorComponent={() => {
                return <Seperator />;
              }}
              refreshControl={refreshComponent}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center'
            }}
          >
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingScreen);
