// @flow

import React, { Component } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
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

function sceneIndex(scene: Scene) {
  const index = SCENE_ORDER.indexOf(scene);
  if (index > -1) return index;
  return 1; // if something goes wrong with props, default to smash.
}

export default class SceneSelector extends Component<Props> {
  constructor(props: Props) {
    super(props);
    const startIndex = sceneIndex(props.scene);
    this.selectedSceneHorizontalPosition = new Animated.Value(
      startIndex / NUM_SCENES
    );
  }

  toggleItem = (index: number) => {
    NavigationService.navigateToCards(SCENE_ORDER[index]);
  };

  selectedSceneHorizontalPosition: AnimatedValue;

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
          onPress={() => this.toggleItem(index)}
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
