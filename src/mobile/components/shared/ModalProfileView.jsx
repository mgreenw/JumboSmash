// @flow

import React from 'react';
import { View, TouchableHighlight, ScrollView, StatusBar } from 'react-native';
import type { UserProfile } from 'mobile/reducers/index';
import Modal from 'react-native-modal';
import CardView from 'mobile/components/shared/CardView';
import { AndroidBackHandler } from 'react-navigation-backhandler';

type Props = {
  isVisible: boolean,
  onSwipeComplete: () => void,
  onBlockReport: ?() => void,
  onMinimize: () => void,
  profile: UserProfile
};

/**
 * Modal to display a profile.
 * pass `null` as `onBlockReport` to not display the block / report button.
 * `onMinimize` gets called when the button is pressed.
 * `onSwipeComplete` does not get used yet, but will if we enable swipe to dismiss functionality.
 */
export default (props: Props) => {
  const {
    isVisible,
    onSwipeComplete,
    onBlockReport,
    onMinimize,
    profile
  } = props;
  return (
    <Modal
      isVisible={isVisible}
      swipeDirection={'down'}
      onSwipeComplete={onSwipeComplete}
      style={{ padding: 0, margin: 0 }}
      propagateSwipe
    >
      <ScrollView>
        <TouchableHighlight>
          <View>
            <StatusBar hidden />
            {profile && (
              <CardView
                profile={profile}
                onMinimize={onMinimize}
                onBlockReport={onBlockReport}
              />
            )}
          </View>
        </TouchableHighlight>
      </ScrollView>
      <AndroidBackHandler
        onBackPress={() => {
          onMinimize();
          return true;
        }}
      />
    </Modal>
  );
};
