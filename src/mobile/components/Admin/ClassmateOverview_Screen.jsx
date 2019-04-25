// @flow

import React from 'react';
import {
  TouchableOpacity,
  View,
  ImageBackground,
  ActivityIndicator,
  Switch,
  Text,
  SafeAreaView,
  Image,
  AlertIOS
} from 'react-native';
import { connect } from 'react-redux';
import GEMHeader from 'mobile/components/shared/Header';
import type { NavigationScreenProp } from 'react-navigation';
import type { ReduxState, Dispatch, UserProfile } from 'mobile/reducers/index';
import NavigationService from 'mobile/components/navigation/NavigationService';
import type { ServerClassmate, Capabilities } from 'mobile/api/serverTypes';
import ModalProfileView from 'mobile/components/shared/ModalProfileView';
import reviewProfileAction from 'mobile/actions/admin/reviewProfile';
import Avatar from 'mobile/components/shared/Avatar';
import { Colors } from 'mobile/styles/colors';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { textStyles } from 'mobile/styles/textStyles';
import { SecondaryButton } from 'mobile/components/shared/buttons';
import Spacer from 'mobile/components/shared/Spacer';
import { profileStatusColor } from './ClassmateList_Screen';

const wavesFull = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type DispatchProps = {
  reviewProfile: (
    password: string,
    userId: number,
    updatedCapabilities: Capabilities,
    comment: ?string
  ) => void
};

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
  return {
    reviewProfile: (
      password: string,
      userId: number,
      updatedCapabilities: Capabilities,
      comment: ?string
    ) => {
      dispatch(
        reviewProfileAction(password, userId, updatedCapabilities, comment)
      );
    }
  };
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

  _confirmReview = (
    selectedCapability: 'canBeSwipedOn' | 'canBeActiveInScenes',
    enableValue: boolean
  ) => {
    const { classmate, reviewProfile } = this.props;
    const { utln, id, capabilities } = classmate;
    const change = enableValue ? 'true' : 'false';

    AlertIOS.prompt(
      `Change "Can Be Swiped On" to ${change} for ${utln}?`,
      'Enter passsword to confirm',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: `Change to ${change}`,
          onPress: password => {
            AlertIOS.prompt(
              'Reason?',
              enableValue ? 'optional for enabling' : 'required for disabling',
              reason => {
                reviewProfile(
                  password,
                  id,
                  {
                    ...capabilities,
                    [selectedCapability]: enableValue
                  },
                  reason.length > 0 ? reason : null
                );
              }
            );
          },
          style: 'destructive'
        }
      ]
    );
  };

  render() {
    const { profile, getProfile_inProgress, classmate } = this.props;
    const { utln, hasProfile, profileStatus } = classmate;
    const { showExpandedCard } = this.state;
    const reviewStatus = hasProfile ? profileStatus : 'NO PROFILE';
    const reviewStatusColor = profileStatusColor(profileStatus, hasProfile);
    return (
      <View style={{ flex: 1, backgroundColor: Colors.White }}>
        <GEMHeader
          title={utln}
          leftIcon={{ name: 'back', onPress: this._onBack }}
        />
        <AndroidBackHandler onBackPress={() => true} />
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
          <ImageBackground
            source={wavesFull}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              zIndex: -1
            }}
          />
          <TouchableOpacity
            style={{ paddingTop: '5.5%' }}
            onPress={this._showExpandedCard}
          >
            {profile !== null && hasProfile ? (
              <Avatar size="Large" photoUuid={profile.photoUuids[0]} border />
            ) : (
              <Image
                style={{ width: 135, height: 135 }}
                source={{
                  uri:
                    'https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg'
                }}
              />
            )}
          </TouchableOpacity>
          <Text
            style={[textStyles.headline6Style, { paddingVertical: '5.5%' }]}
          >
            {'Review Status: '}
            <Text
              style={[
                textStyles.headline5StyleDemibold,
                { textAlign: 'center', backgroundColor: reviewStatusColor }
              ]}
            >
              {reviewStatus}
            </Text>
          </Text>

          <View
            style={{
              flex: 1,
              backgroundColor: Colors.White,
              width: '100%',
              paddingHorizontal: 30,
              alignItems: 'center',
              paddingTop: 25,
              paddingBottom: 35,
              shadowColor: '#6F6F6F',
              shadowOpacity: 0.57,
              shadowRadius: 2,
              shadowOffset: {
                height: 2,
                width: 1
              },
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10
            }}
          >
            {getProfile_inProgress ? (
              <ActivityIndicator />
            ) : (
              <View style={{ width: '100%' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 20,
                    alignItems: 'center',
                    paddingLeft: 10,
                    width: '100%'
                  }}
                >
                  <Text style={textStyles.body1Style}>Can Be Swiped On</Text>
                  <Switch
                    value={classmate.capabilities.canBeSwipedOn}
                    trackColor={{ true: Colors.AquaMarine }}
                    onValueChange={value => {
                      this._confirmReview('canBeSwipedOn', value);
                    }}
                  />
                </View>
                <Spacer style={{ marginBottom: 8 }} />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 20,
                    alignItems: 'center',
                    paddingLeft: 10,
                    width: '100%'
                  }}
                >
                  <Text style={textStyles.body1Style}>
                    Can Be Active In Scenes
                  </Text>
                  <Switch
                    value={classmate.capabilities.canBeActiveInScenes}
                    trackColor={{ true: Colors.AquaMarine }}
                    onValueChange={value => {
                      this._confirmReview('canBeActiveInScenes', value);
                    }}
                  />
                </View>
                <Spacer style={{ marginBottom: 8 }} />
                <SecondaryButton
                  title={'Ban'}
                  onPress={() => {}}
                  style={{ justifySelf: 'flex-end' }}
                />
              </View>
            )}
          </View>
        </SafeAreaView>
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
