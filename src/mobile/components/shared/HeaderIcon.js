// @flow
import React from "react";
import { View, TouchableOpacity, Keyboard } from "react-native";
import type { UserProfile, Candidate } from "mobile/reducers";
import CustomIcon from "mobile/assets/icons/CustomIcon";
import type { IconName } from "mobile/assets/icons/CustomIcon";
import NavigationService from "mobile/NavigationService";
import { routes } from "mobile/components/Navigation";

type Props = {
  name: ?IconName,
  disabled?: boolean,
  onPress?: () => void
};

type State = {};

export class HeaderIcon extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.disabled != this.props.disabled) {
      const opacity = this.props.disabled ? 0.2 : 1;
      this.iconTouchableOpacity.setOpacityTo(opacity);
    }
  }

  _inferOnPress = (name: IconName): (() => void) => {
    switch (name) {
      case "user": {
        return () => {
          NavigationService.navigate(routes.Profile);
        };
      }
      case "message": {
        return () => {
          NavigationService.navigate(routes.Matches);
        };
      }
      case "cards": {
        return () => {
          NavigationService.navigate(routes.Cards);
        };
      }
      case "back": {
        return () => {
          NavigationService.back();
        };
      }
      default:
        throw ("Could not parse icon name: ", name);
    }
  };

  // for refs
  iconTouchableOpacity: TouchableOpacity;

  render() {
    const onPress =
      this.props.name && !this.props.disabled
        ? this.props.onPress || this._inferOnPress(this.props.name)
        : () => {};
    // TODO: make this styling via a style sheet, and better!
    return (
      <TouchableOpacity
        ref={self => (this.iconTouchableOpacity = self)}
        style={{
          paddingLeft: 22,
          paddingRight: 22,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          opacity: this.props.disabled ? 0.2 : 1
        }}
        onPress={() => {
          Keyboard.dismiss(); // in case a keyboard is up, buttons close them
          onPress();
        }}
      >
        <CustomIcon
          name={this.props.name || "user"}
          size={26}
          color={this.props.name ? "black" : "transparent"}
        />
      </TouchableOpacity>
    );
  }
}
