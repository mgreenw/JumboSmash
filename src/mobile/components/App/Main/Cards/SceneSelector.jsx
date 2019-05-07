// @flow

import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { Scene } from 'mobile/reducers';
import { Colors } from 'mobile/styles/colors';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { sceneToEmoji } from 'mobile/utils/emojis';

type Props = {
  scene: Scene
};

const SCENE_ORDER: Scene[] = ['social', 'smash', 'stone'];
const NUM_SCENES = SCENE_ORDER.length;
const ICON_WIDTH = 40;

export default class SceneSelector extends Component<Props> {
  _onIconPress = (index: number) => {
    NavigationService.navigateToCards(SCENE_ORDER[index]);
  };

  render() {
    const { scene: currentScene } = this.props;
    const renderedScenes = SCENE_ORDER.map((scene, index) => (
      <View
        key={scene}
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
      >
        <TouchableOpacity
          style={{
            alignItems: 'center',
            height: ICON_WIDTH,
            width: ICON_WIDTH,
            alignContent: 'center',
            justifyContent: 'center',
            borderRadius: 25,
            borderWidth: 2,
            backgroundColor:
              scene === currentScene ? Colors.White : 'transparent',
            borderColor:
              scene === currentScene ? Colors.AquaMarine : 'transparent'
          }}
          onPress={() => this._onIconPress(index)}
        >
          <Text
            style={{
              fontSize: 20
            }}
          >
            {sceneToEmoji(scene)}
          </Text>
        </TouchableOpacity>
      </View>
    ));

    return (
      <View
        style={{
          flexDirection: 'row',
          width: ICON_WIDTH * NUM_SCENES,
          borderRadius: 50,
          backgroundColor: Colors.Grey80,
          height: ICON_WIDTH
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            borderColor: Colors.Grey80,
            borderRadius: 50,
            borderWidth: 0
          }}
        >
          {renderedScenes}
        </View>
      </View>
    );
  }
}
