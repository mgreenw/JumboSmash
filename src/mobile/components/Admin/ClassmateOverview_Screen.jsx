// @flow

import React from 'react';
import {
  TouchableOpacity,
  View,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import GEMHeader from 'mobile/components/shared/Header';
import type { NavigationScreenProp } from 'react-navigation';
import type { ReduxState, Dispatch, UserProfile } from 'mobile/reducers/index';
import NavigationService from 'mobile/components/navigation/NavigationService';
import type { ServerClassmate } from 'mobile/api/serverTypes';
import ModalProfileView from 'mobile/components/shared/ModalProfileView';
import Avatar from 'mobile/components/shared/Avatar';

const wavesFull = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type DispatchProps = {};

type ReduxProps = {
  getProfile_inProgress: boolean,
  profile: null | UserProfile,
  classmate: ServerClassmate
};

type Props = DispatchProps & ReduxProps & NavigationProps;

function mapStateToProps(state: ReduxState, ownProps: Props): ReduxProps {
  const userId: number = ownProps.navigation.getParam('id', null);
  const getProfile_inProgress = state.inProgress.getProfile[userId];
  return {
    getProfile_inProgress,
    profile: getProfile_inProgress ? null : state.profiles[userId],
    classmate: state.classmatesById[userId]
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {};
}

type State = {
  showExpandedCard: boolean
};

class ClassmateOverviewScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showExpandedCard: false
    };
  }

  _onBack = () => {
    const { navigation } = this.props;
    NavigationService.back(navigation.state.key);
  };

  _showExpandedCard = () => {
    this.setState({
      showExpandedCard: true
    });
  };

  _hideExpandedCard = () => {
    this.setState({
      showExpandedCard: false
    });
  };

  render() {
    const { profile, getProfile_inProgress, classmate } = this.props;
    const { showExpandedCard } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title={classmate.utln}
          leftIcon={{ name: 'back', onPress: this._onBack }}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {getProfile_inProgress || profile === null ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity onPress={this._showExpandedCard}>
              <Avatar size="Large" photoUuid={profile.photoUuids[0]} border />
            </TouchableOpacity>
          )}
          <ImageBackground
            source={wavesFull}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              zIndex: -1
            }}
          />
        </View>
        {profile && (
          <ModalProfileView
            isVisible={showExpandedCard}
            onSwipeComplete={this._hideExpandedCard}
            onBlockReport={null}
            onMinimize={() => {
              this.setState({
                showExpandedCard: false
              });
            }}
            profile={profile}
          />
        )}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassmateOverviewScreen);
