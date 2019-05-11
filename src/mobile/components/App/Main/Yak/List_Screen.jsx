// @flow

import React from 'react';
import {
  View,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  Switch
} from 'react-native';
import GEMHeader from 'mobile/components/shared/Header';
import NavigationService from 'mobile/components/navigation/NavigationService';
import routes from 'mobile/components/navigation/routes';
import type { NavigationScreenProp } from 'react-navigation';
import type { ReduxState, Dispatch } from 'mobile/reducers';
import type { Yak } from 'mobile/api/serverTypes';
import getYaksAction from 'mobile/actions/yaks/getYaks';
import { connect } from 'react-redux';
import { Colors } from 'mobile/styles/colors';
import YakComponent from './Yak';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type NavigationProps = {
  /* eslint-disable-next-line react/no-unused-prop-types */
  navigation: NavigationScreenProp<any>
};

type DispatchProps = {
  getYaks: () => void
};

type ReduxProps = {
  getYaksInProgress: boolean,
  currentYakIds: { byTime: number[], byScore: number[] },
  clientYakIds: number[],
  yakMap: { [id: number]: Yak }
};

type SortOption = 'score' | 'time';

type Props = NavigationProps & DispatchProps & ReduxProps;
type State = {
  yaksLoaded: boolean,
  /**
   * Used to determine if we are refreshing matches because the user pullled down on the scrollview.
   * If false, then we don't show the animation (causing the load to occur in the background).
   * Default to false when no refresh occuring.
   */
  refreshManuallyTriggered: boolean,
  sortBy: SortOption
};

function mapStateToProps({ yaks }: ReduxState): ReduxProps {
  const { inProgress, byId, currentYakIds, clientYakIds } = yaks;
  return {
    getYaksInProgress: inProgress.get,
    currentYakIds: {
      byTime: currentYakIds.slice().reverse(),
      byScore: currentYakIds.slice().sort((a, b) => {
        const { score: scoreA } = byId[a];
        const { score: scoreB } = byId[b];
        if (scoreA > scoreB) return -1;
        if (scoreA < scoreB) return 1;
        return 0;
      })
    },
    clientYakIds,
    yakMap: byId
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    getYaks: () => {
      dispatch(getYaksAction());
    }
  };
}

/* eslint-disable-next-line no-unused-vars */
class YakListScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      yaksLoaded: false,
      refreshManuallyTriggered: false,
      sortBy: 'score'
    };
  }

  componentDidMount() {
    const { getYaks } = this.props;
    getYaks();
  }

  componentDidUpdate(prevProps: Props) {
    const { getYaksInProgress } = this.props;
    if (prevProps.getYaksInProgress && !getYaksInProgress) {
      // We're doing this safely
      /* eslint-disable-next-line react/no-did-update-set-state */
      this.setState({
        yaksLoaded: true,
        refreshManuallyTriggered: false
      });
    }
  }

  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%'
        }}
      />
    );
  };

  _renderYak = (id: number) => {
    const { yakMap } = this.props;
    const yak = yakMap[id];
    return yak ? (
      <YakComponent
        yak={yak}
        onPress={() => {
          this._onPress(id);
        }}
      />
    ) : null;
  };

  _onPress = (id: number) => {
    console.log('pressed: ', id);
  };

  /**
   * Set state to refreshing, then call the getYaks Api.
   */
  _onRefresh = () => {
    const { getYaks } = this.props;
    this.setState({ refreshManuallyTriggered: true }, getYaks);
  };

  render() {
    const { refreshManuallyTriggered, yaksLoaded, sortBy } = this.state;
    const { currentYakIds } = this.props;
    if (!yaksLoaded) {
      return (
        <View
          style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center'
          }}
        >
          <ActivityIndicator />
        </View>
      );
    }
    const refreshComponent = (
      <RefreshControl
        refreshing={refreshManuallyTriggered}
        onRefresh={this._onRefresh}
      />
    );

    const Header = (
      <View
        style={{
          width: '100%',
          padding: 20,
          backgroundColor: Colors.White,
          marginTop: 1,
          marginBottom: 1
        }}
      >
        <Switch
          value={sortBy === 'score'}
          onValueChange={isScore => {
            this.setState({ sortBy: isScore ? 'score' : 'time' });
          }}
        />
      </View>
    );
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
        />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <FlatList
            data={
              sortBy === 'time' ? currentYakIds.byTime : currentYakIds.byScore
            }
            renderItem={({ item: id }) => {
              return this._renderYak(id);
            }}
            keyExtractor={code => {
              return code.toString();
            }}
            ItemSeparatorComponent={this._renderSeparator}
            refreshControl={refreshComponent}
            ListHeaderComponent={Header}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YakListScreen);
