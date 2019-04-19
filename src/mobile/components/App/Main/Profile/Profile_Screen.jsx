// @flow

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import Avatar from 'mobile/components/shared/Avatar';
import type { ReduxState, UserProfile } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import GEMHeader from 'mobile/components/shared/Header';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import type { IconName } from 'mobile/assets/icons/CustomIcon';
import ModalProfileView from 'mobile/components/shared/ModalProfileView';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type cardButtonProps = {
  title: string,
  onPress: () => void,
  icon: IconName,
  loading: boolean
};
class CardButton extends React.PureComponent<cardButtonProps> {
  render() {
    const { onPress, icon, title, loading } = this.props;
    return (
      <View style={{ flex: 1, opacity: null }}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: 'transparent',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: '16.5%'
          }}
          disabled={loading}
        >
          <View style={{ flexDirection: 'row', opacity: loading ? 0.2 : null }}>
            <CustomIcon name={icon} size={26} color="black" />
            <Text style={[textStyles.headline6Style, { paddingLeft: 20 }]}>
              {title}
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <CustomIcon
              name="back"
              style={{ transform: [{ rotate: '180deg' }] }}
              size={26}
              color="black"
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

type NavigationProps = {
  navigation: any
};

type DispatchProps = {};

type ReduxProps = {
  photoUuid: string,
  displayName: string,
  profile: UserProfile,
  saveProfileInProgress: boolean,
  saveSettingsInProgress: boolean,
  isAdmin: boolean
};

type Props = NavigationProps & DispatchProps & ReduxProps;

type State = {
  showExpandedCard: boolean
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  if (!reduxState.client) {
    throw new Error('client is null in Profile Screen');
  }
  const photoUuids = reduxState.client.profile.photoUuids;
  if (photoUuids.length === 0) {
    throw new Error('no photos in Profile Screen');
  }
  return {
    displayName: reduxState.client.profile.fields.displayName,
    photoUuid: photoUuids[0],
    profile: reduxState.client.profile,
    saveProfileInProgress: reduxState.inProgress.saveProfile,
    saveSettingsInProgress: reduxState.inProgress.saveSettings,
    isAdmin: reduxState.client.settings.isAdmin
  };
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

class ProfileScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showExpandedCard: false
    };
  }

  _onSettingsPress = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    navigate(routes.SettingsEdit, {});
  };

  _onProfileEditPress = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    navigate(routes.ProfileEdit, {});
  };

  _onProfileHelpPress = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    navigate(routes.ProfileHelp, {});
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
    const {
      photoUuid,
      displayName,
      profile,
      saveProfileInProgress,
      saveSettingsInProgress,
      isAdmin
    } = this.props;
    const { showExpandedCard } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Profile"
          rightIconName="cards"
          leftIcon={isAdmin ? 'admin' : null}
        />
        <ImageBackground
          source={wavesFull}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: -1
          }}
        />
        <View
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              paddingTop: 20,
              paddingBottom: 20
            }}
          >
            <TouchableOpacity onPress={this._showExpandedCard}>
              <Avatar size="Large" photoUuid={photoUuid} border />
            </TouchableOpacity>
            <Text
              style={[
                textStyles.headline4StyleDemibold,
                { textAlign: 'center', paddingTop: 10 }
              ]}
            >
              {displayName}
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: 'space-evenly',
              backgroundColor: Colors.White,
              shadowColor: '#6F6F6F',
              shadowOpacity: 0.57,
              shadowRadius: 2,
              shadowOffset: {
                height: -1,
                width: 1
              },
              borderRadius: 10
            }}
            elevation={5}
          >
            <CardButton
              title="Edit Profile"
              onPress={this._onProfileEditPress}
              icon="user"
              loading={saveProfileInProgress}
            />
            <CardButton
              title="Settings"
              onPress={this._onSettingsPress}
              icon="gear"
              loading={saveSettingsInProgress}
            />
            <CardButton
              title="Help & Contact"
              onPress={this._onProfileHelpPress}
              icon="life-ring"
              loading={false}
            />
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
          </View>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);
