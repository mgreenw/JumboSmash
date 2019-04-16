// @flow

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from 'mobile/styles/colors';

const FILL_LENGTH = 10;
const PADDING = 3;
const TOTAL_LENGTH = FILL_LENGTH + PADDING;

const styles = StyleSheet.create({
  badgeFill: {
    height: FILL_LENGTH,
    width: FILL_LENGTH,
    borderRadius: FILL_LENGTH,
    backgroundColor: Colors.Grapefruit
  },
  badgeOutline: {
    height: TOTAL_LENGTH,
    width: TOTAL_LENGTH,
    borderRadius: TOTAL_LENGTH,
    backgroundColor: Colors.White,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

type BadgeProps = {
  badgeContainerStyle: ?StyleSheet.Styles
};

const Badge = ({ badgeContainerStyle }: BadgeProps) => {
  return (
    <View style={{ ...styles.badgeOutline, ...badgeContainerStyle }}>
      <View style={styles.badgeFill} />
    </View>
  );
};

// For Header Icons
const IconBadge = (props: BadgeProps) => {
  return (
    <View style={{ left: -TOTAL_LENGTH / 2 }}>
      <Badge {...props} />
    </View>
  );
};

// For Avatar Badges in Messages
const AvatarBadge = (props: BadgeProps) => {
  return (
    <View style={{ right: -TOTAL_LENGTH / 2, top: -TOTAL_LENGTH / 2 }}>
      <Badge {...props} />
    </View>
  );
};

export { Badge, IconBadge, AvatarBadge };
