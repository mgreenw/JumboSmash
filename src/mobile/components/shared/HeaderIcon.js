// @flow
import React from "react";
import { View, TouchableOpacity } from "react-native";
import type { UserProfile, Candidate } from "mobile/reducers";
import CustomIcon from "mobile/assets/icons/CustomIcon";
import NavigationService from "mobile/NavigationService";
import { routes } from "mobile/components/Navigation";

// add more from fontello as needed. See "demo.html" of the fontello
// config if you need to figure out the names.
export type IconName = "user" | "message" | "cards" | "back";
type Props = {
  name: ?IconName,
  disabled?: boolean
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

  _onPress = (name: IconName): (() => void) => {
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
        onPress={
          this.props.name && !this.props.disabled
            ? this._onPress(this.props.name)
            : null
        }
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
