// @flow

import React from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import type { IconName } from 'mobile/assets/icons/CustomIcon';
import NavigationService from 'mobile/components/navigation/NavigationService';
import routes from 'mobile/components/navigation/routes';
import Badge from 'mobile/components/shared/Badge';

type Props = {
  name: ?IconName,
  disabled?: boolean,
  badge?: boolean,
  onPress?: () => void
};

type State = {};

export default class HeaderIcon extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps: Props) {
    const { disabled } = this.props;
    if (prevProps.disabled !== disabled) {
      const opacity = disabled ? 0.2 : 1;
      this.iconTouchableOpacity.setOpacityTo(opacity);
    }
  }

  _inferOnPress = (name: IconName): (() => void) => {
    switch (name) {
      case 'user': {
        return () => {
          NavigationService.navigate(routes.Profile);
        };
      }
      case 'message': {
        return () => {
          NavigationService.navigate(routes.Matches);
        };
      }
      case 'cards': {
        return () => {
          NavigationService.navigate(routes.Cards);
        };
      }
      case 'back': {
        return () => {
          NavigationService.back();
        };
      }
      default:
        throw new Error(`Could not parse icon name: ${name}`);
    }
  };

  // for refs
  iconTouchableOpacity: TouchableOpacity;

  render() {
    const { name, disabled, onPress: onPressProp, badge } = this.props;
    const onPress =
      name && !disabled ? onPressProp || this._inferOnPress(name) : () => {};
    // TODO: make this styling via a style sheet, and better!
    return (
      <TouchableOpacity
        ref={self => (this.iconTouchableOpacity = self)}
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: disabled ? 0.2 : 1
        }}
        onPress={() => {
          Keyboard.dismiss(); // in case a keyboard is up, buttons close them
          onPress();
        }}
      >
        <CustomIcon
          name={name || 'user'}
          size={26}
          color={name ? 'black' : 'transparent'}
        />
        <View
          style={{
            position: 'absolute',
            left: 0
          }}
        >
          {/* only show the badge on an actual icon */
          name && badge && <Badge />}
        </View>
      </TouchableOpacity>
    );
  }
}
