// @flow

import React from 'react';
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import GEMHeader from 'mobile/components/shared/Header';
import NavigationService from 'mobile/components/navigation/NavigationService';
import routes from 'mobile/components/navigation/routes';
import { ListItem } from 'react-native-elements';
import type { NavigationScreenProp } from 'react-navigation';
import type { ReduxState, Dispatch } from 'mobile/reducers';
import type { Yak } from 'mobile/api/serverTypes';
import getYaksAction from 'mobile/actions/yaks/getYaks';
import { connect } from 'react-redux';

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
  currentYakIds: number[],
  clientYakIds: number[],
  yakMap: { [id: number]: Yak }
};

type Props = NavigationProps & DispatchProps & ReduxProps;
type State = {
  yaksLoaded: boolean,
  /**
   * Used to determine if we are refreshing matches because the user pullled down on the scrollview.
   * If false, then we don't show the animation (causing the load to occur in the background).
   * Default to false when no refresh occuring.
   */
  refreshManuallyTriggered: boolean
};

function mapStateToProps({ yaks }: ReduxState): ReduxProps {
  const { inProgress, byId, currentYakIds, clientYakIds } = yaks;
  return {
    getYaksInProgress: inProgress.get,
    currentYakIds,
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
class YackListScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      yaksLoaded: false,
      refreshManuallyTriggered: false
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
    const { refreshManuallyTriggered, yaksLoaded } = this.state;
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
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <FlatList
            data={[0, 1, 2, 3, 4, 5]}
            renderItem={({ item: id }) => (
              <ListItem
                onPress={() => {
                  this._onPress(id);
                }}
                title={`yak_id: ${id}`}
              />
            )}
            keyExtractor={code => {
              return code.toString();
            }}
            ItemSeparatorComponent={this._renderSeparator}
            ListHeaderComponent={this._renderSeparator}
            refreshing={refreshManuallyTriggered}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YackListScreen);
