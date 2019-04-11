// @flow

import React from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import Avatar from 'mobile/components/shared/Avatar';
import type { UserProfile, Scene } from 'mobile/reducers';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import capitalize from 'mobile/utils/Capitalize';
import {
  PrimaryButton,
  SecondaryButton
} from 'mobile/components/shared/buttons';

type Props = {
  isVisible: boolean,
  clientProfile: UserProfile,
  matchProfile: UserProfile,
  scene: Scene,
  onStartChatting: () => void,
  onKeepSwiping: () => void
};

export default (props: Props) => {
  const {
    isVisible,
    clientProfile,
    matchProfile,
    scene,
    onStartChatting,
    onKeepSwiping
  } = props;
  return (
    <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      isVisible={isVisible}
      onSwipeComplete={() => {}}
      backdropOpacity={0.8}
      style={{ padding: 0, margin: 0 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View style={{ right: -20 }}>
            <Avatar
              size={'Large'}
              photoUuid={clientProfile.photoUuids[0]}
              border
            />
          </View>
          <View style={{ left: -20 }}>
            <Avatar
              size={'Large'}
              photoUuid={matchProfile.photoUuids[0]}
              border
            />
          </View>
        </View>
        <Text
          style={[
            textStyles.headline5Style,
            { color: Colors.White, paddingTop: 20, textAlign: 'center' }
          ]}
        >
          {`${'You matched in \nJumbo'}${capitalize(scene)} with`}
        </Text>
        <Text
          style={[
            textStyles.headline4StyleDemibold,
            { color: Colors.Grapefruit, textAlign: 'center' }
          ]}
        >
          {`${matchProfile.fields.displayName}!`}
        </Text>
        <View
          style={{
            paddingTop: 40,
            paddingBottom: 80,
            justifySelf: 'flex-end'
          }}
        >
          <PrimaryButton title={'Start Chatting'} onPress={onStartChatting} />
          <View style={{ height: 20 }} />

          <SecondaryButton title={"Keep Swipin'"} onPress={onKeepSwiping} />
        </View>
      </View>
    </Modal>
  );
};
