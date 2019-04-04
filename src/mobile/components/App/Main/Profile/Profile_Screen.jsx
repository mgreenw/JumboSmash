// @flow

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import Avatar from 'mobile/components/shared/Avatar';
import type { ReduxState, UserProfile } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import GEMHeader from 'mobile/components/shared/Header';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import { Arthur_Styles as ArthurStyles } from 'mobile/styles/Arthur_Styles';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import type { IconName } from 'mobile/assets/icons/CustomIcon';

const waves1 = require('../../../../assets/waves/waves1/waves.png');

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

type navigationProps = {
  navigation: any
};

type dispatchProps = {};

type reduxProps = {
  photoUuid: string,
  displayName: string,
  profile: UserProfile,
  saveProfileInProgress: boolean,
  saveSettingsInProgress: boolean
};

type Props = navigationProps & dispatchProps & reduxProps;

type State = {};

function mapStateToProps(reduxState: ReduxState): reduxProps {
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
    saveSettingsInProgress: reduxState.inProgress.saveSettings
  };
}

function mapDispatchToProps(): dispatchProps {
  return {};
}

class ProfileScreen extends React.Component<Props, State> {
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

  render() {
    const {
      photoUuid,
      displayName,
      navigation,
      profile,
      saveProfileInProgress,
      saveSettingsInProgress
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader title="Profile" rightIconName="cards" />
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
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(routes.ProfileExpandedCard, {
                  profile,
                  onMinimize: () => navigation.pop()
                })
              }
            >
              <Avatar size="Large" photoUuid={photoUuid} />
            </TouchableOpacity>
            <Text
              style={[
                textStyles.headline4StyleDemibold,
                { textAlign: 'center', paddingTop: 10 }
              ]}
            >
              {displayName}
            </Text>
            <Image
              resizeMode="stretch"
              source={waves1}
              style={[ArthurStyles.waves, { zIndex: -1, bottom: -10 }]}
            />
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
