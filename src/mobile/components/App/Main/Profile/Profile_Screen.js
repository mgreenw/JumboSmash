// @flow

import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Button, Icon, Avatar } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import GEMHeader from "mobile/components/shared/Header";
import { Transition } from "react-navigation-fluid-transitions";
import { textStyles } from "mobile/styles/textStyles";
import { Colors } from "mobile/styles/colors";
import { Arthur_Styles } from "mobile/styles/Arthur_Styles";
import CustomIcon from "mobile/assets/icons/CustomIcon";
import type { IconName } from "mobile/assets/icons/CustomIcon";

const waves1 = require("../../../../assets/waves/waves1/waves.png");

type cardButtonProps = {
  title: string,
  onPress: () => void,
  icon: IconName
};
class CardButton extends React.Component<cardButtonProps> {
  constructor(props: cardButtonProps) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          backgroundColor: "transparent",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 60,
          paddingRight: 60
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <CustomIcon name={this.props.icon} size={26} color={"black"} />
          <Text style={[textStyles.headline6Style, { paddingLeft: 20 }]}>
            {this.props.title}
          </Text>
        </View>
        <CustomIcon
          name={"back"}
          style={{ transform: [{ rotate: "180deg" }] }}
          size={26}
          color={"black"}
        />
      </TouchableOpacity>
    );
  }
}

type navigationProps = {
  navigation: any
};

type dispatchProps = {};

type reduxProps = { displayName: string };

type Props = navigationProps & dispatchProps & reduxProps;

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): reduxProps {
  if (!reduxState.user) {
    throw "reduxState user is null";
  }
  return {
    displayName: reduxState.user.profile.displayName
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): dispatchProps {
  return {};
}

class ProfileScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = ({ navigation }) => {
    return { header: null };
  };

  _onSettingsPress = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.SettingsEdit, {});
  };

  _onProfileEditPress = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.ProfileEdit, {});
  };

  _onProfileHelpPress = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.ProfileHelp, {});
  };

  render() {
    return (
      <Transition inline appear="left">
        <View style={{ flex: 1 }}>
          <GEMHeader screen="profile" />
          <View
            style={{
              flex: 1
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-evenly",
                alignItems: "center",
                paddingTop: 20,
                paddingBottom: 20
              }}
            >
              <Avatar
                size="xlarge"
                rounded
                source={{
                  uri:
                    "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
                }}
              />
              <Text
                style={[
                  textStyles.headline4StyleMedium,
                  { textAlign: "center", paddingTop: 10 }
                ]}
              >
                {this.props.displayName}
              </Text>
              <Image
                resizeMode="stretch"
                source={waves1}
                style={[Arthur_Styles.waves, { zIndex: -1, bottom: -10 }]}
              />
            </View>
            <View
              style={{
                flex: 2,
                justifyContent: "space-evenly",
                backgroundColor: Colors.White,
                shadowColor: "#6F6F6F",
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
                icon={"user"}
              />
              <CardButton
                title="Settings"
                onPress={this._onSettingsPress}
                icon={"gear"}
              />
              <CardButton
                title="Help & Contact"
                onPress={this._onProfileHelpPress}
                icon={"life-ring"}
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
  mapDispatchToProps
)(ProfileScreen);
