// @flow

import React from 'react';
import {
  TouchableOpacity, Text, View, Image,
} from 'react-native';
import { connect } from 'react-redux';
import { Avatar } from 'react-native-elements';
import type { ReduxState } from 'mobile/reducers/index';
import { routes } from 'mobile/components/Navigation';
import GEMHeader from 'mobile/components/shared/Header';
import { Transition } from 'react-navigation-fluid-transitions';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import { Arthur_Styles as ArthurStyles } from 'mobile/styles/Arthur_Styles';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import type { IconName } from 'mobile/assets/icons/CustomIcon';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';

const waves1 = require('../../../../assets/waves/waves1/waves.png');

type cardButtonProps = {
  title: string,
  onPress: () => void,
  icon: IconName,
};
class CardButton extends React.PureComponent<cardButtonProps> {
  render() {
    const { onPress, icon, title } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <CustomIcon name={icon} size={26} color="black" />
          <Text style={[textStyles.headline6Style, { paddingLeft: 20 }]}>{title}</Text>
        </View>
        <CustomIcon
          name="back"
          style={{ transform: [{ rotate: '180deg' }] }}
          size={26}
          color="black"
        />
      </TouchableOpacity>
    );
  }
}

type navigationProps = {
  navigation: any,
};

type dispatchProps = {};

type reduxProps = { token: ?string, photoId: number, displayName: string };

type Props = navigationProps & dispatchProps & reduxProps;

type State = {};

function mapStateToProps(reduxState: ReduxState): reduxProps {
  if (!reduxState.client) {
    throw new Error('client is null in Profile Screen');
  }
  const photoIds = reduxState.client.profile.photoIds;
  if (photoIds.length === 0) {
    throw new Error('no photos in Profile Screen');
  }
  return {
    displayName: reduxState.client.profile.displayName,
    photoId: photoIds[0],
    token: reduxState.token,
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
    const { token, photoId, displayName } = this.props;
    return (
      <Transition inline appear="left">
        <View style={{ flex: 1 }}>
          <GEMHeader title="Profile" rightIconName="cards" />
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingTop: 20,
                paddingBottom: 20,
              }}
            >
              <Avatar
                size="xlarge"
                rounded
                source={{
                  uri: GET_PHOTO__ROUTE + photoId,
                  headers: {
                    Authorization: token,
                  },
                }}
              />
              <Text
                style={[textStyles.headline4StyleMedium, { textAlign: 'center', paddingTop: 10 }]}
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
                  width: 1,
                },
                borderRadius: 10,
              }}
              elevation={5}
            >
              <CardButton title="Edit Profile" onPress={this._onProfileEditPress} icon="user" />
              <CardButton title="Settings" onPress={this._onSettingsPress} icon="gear" />
              <CardButton
                title="Help & Contact"
                onPress={this._onProfileHelpPress}
                icon="life-ring"
              />
            </View>
          </View>
        </View>
      </Transition>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen);
