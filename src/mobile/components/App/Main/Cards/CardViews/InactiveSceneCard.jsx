// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import type { Scene } from 'mobile/reducers';

const SCENE_META_DATA = {
  smash: {
    display: 'JumboSmash',
    icon: '🍑',
    description: 'This is where you can match with people to get ~frisky~'
  },
  social: {
    display: 'JumboSocial',
    icon: '🐘',
    description:
      'This is where you can match with people for hanging out - from study buddies to a night out on the town.'
  },
  stone: {
    display: 'JumboStone',
    icon: '🍀',
    description:
      'This is where you can match with people to get blazed out of your mind'
  }
};

type Props = {
  scene: Scene,
  onEnable: () => void,
  loading: boolean
};

export default (props: Props) => {
  const { scene, onEnable, loading } = props;
  const sceneData = SCENE_META_DATA[scene];

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.White
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[textStyles.headline5Style, { textAlign: 'center' }]}>
          Welcome to
        </Text>
        <Text
          style={[
            textStyles.jumboSmashStyle,
            { fontSize: 40, padding: 15, textAlign: 'center' }
          ]}
        >
          {sceneData.display}
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: Colors.Grapefruit,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 69 }}>{sceneData.icon}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Text style={[textStyles.headline6Style, { textAlign: 'center' }]}>
          {sceneData.description}
        </Text>
      </View>
      <PrimaryButton
        onPress={onEnable}
        title={`Enable ${sceneData.display}`}
        loading={loading}
        disabled={loading}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
          {`You won’t be shown in ${sceneData.display}
unless you turn it on in Settings.`}
        </Text>
      </View>
    </View>
  );
};
