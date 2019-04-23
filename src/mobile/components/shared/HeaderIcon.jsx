// @flow

import React from 'react';
import { View, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import type { IconName } from 'mobile/assets/icons/CustomIcon';
import NavigationService from 'mobile/components/navigation/NavigationService';
import routes from 'mobile/components/navigation/routes';
import { IconBadge } from 'mobile/components/shared/Badge';

type Props = {
  name: ?IconName,
  disabled?: boolean,
  badge?: boolean,
  onPress: () => void
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

  // for refs
  iconTouchableOpacity: TouchableOpacity;

  render() {
    const { name, disabled, onPress: onPressProp, badge } = this.props;
    const onPress = name && !disabled ? onPressProp : () => {};
    // TODO: make this styling via a style sheet, and better!
    const { width } = Dimensions.get('window');
    return (
      <TouchableOpacity
        ref={self => (this.iconTouchableOpacity = self)}
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          // The component decides the padding so that we can control the hitslop here.
          paddingHorizontal: 0.068 * width,
          opacity: disabled ? 0.2 : 1
        }}
        onPress={() => {
          Keyboard.dismiss(); // in case a keyboard is up, buttons close them
          onPress();
        }}
      >
        <View>
          <CustomIcon
            name={name || 'user'}
            size={26}
            color={name ? 'black' : 'transparent'}
          />
          <View
            style={{
              position: 'absolute'
            }}
          >
            {/* only show the badge on an actual icon 
          TODO: enable when logic to display is enabled. */
            name === 'message' && badge && <IconBadge />}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
