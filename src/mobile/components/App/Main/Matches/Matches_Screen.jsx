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
import AvatarList from 'mobile/components/shared/AvatarList';
import Avatar from 'mobile/components/shared/Avatar';

type NavigationProps = {};

type ReduxProps = {
  matches: ?(Match[]),
  getMatchesInProgress: boolean
};

type DispatchProps = {
  getMatches: () => void
};

type Props = ReduxProps & NavigationProps & DispatchProps;

type State = {};

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

type Item = {
  time: string
};

const list = [
  { time: '4h' },
  { time: '6h' },
  { time: '6h' },
  { time: '1d' },
  { time: '2d' },
  { time: '2d' },
  { time: '3d' }
];

class MessagingScreen extends React.Component<Props, State> {
  keyExtractor = (item: Item, index: number) => `${index}`;

  renderItem = item => (
    <TouchableOpacity
      style={{ height: 90, width: '100%', paddingHorizontal: 15 }}
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
          size="large"
          rounded
          source={{
            uri:
              'https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg'
          }}
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
          <Text style={textStyles.body1Style}>Name</Text>
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
            {item.item.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { getMatchesInProgress, getMatches, matches } = this.props;

    return (
      <Transition inline appear="right">
        <View style={{ flex: 1 }}>
          <GEMHeader title="Messages" leftIconName="cards" />
          <View style={{ flex: 1 }}>
            <FlatList
              ListHeaderComponent={<AvatarList matches={matches} />}
              data={list}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              refreshControl={
                <RefreshControl
                  refreshing={getMatchesInProgress}
                  onRefresh={getMatches}
                />
              }
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
