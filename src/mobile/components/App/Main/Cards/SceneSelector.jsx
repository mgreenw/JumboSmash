// @flow

import React, { Component } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type { Scene } from 'mobile/reducers';
import { Colors } from 'mobile/styles/colors';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { NavigationEvents } from 'react-navigation';

type Props = {
  scene: Scene
};

const SCENES: { label: string, value: Scene }[] = [
  { label: '🐘', value: 'social' },
  { label: '🍑', value: 'smash' }
];

// helper function -- should be made more modular with the Emojis util we have later.
// for now just a quick hack for sanity.
function sceneIndex(scene: Scene) {
  return scene === 'smash' ? 1 : 0;
}

const WIDTH = 40 * SCENES.length;

export default class SceneSelector extends Component<Props> {
  constructor(props: Props) {
    super(props);
    const startIndex = sceneIndex(props.scene);
    this.selectedSceneHorizontalPosition = new Animated.Value(
      startIndex / SCENES.length
    );
  }

  animate = (value: AnimatedValue) => {
    Animated.timing(this.selectedSceneHorizontalPosition, {
      toValue: value,
      duration: 100,
      easing: Easing.cubic,
      useNativeDriver: true
    }).start();
  };

  toggleItem = (index: number) => {
    this.animate(index / SCENES.length);
    // TOOD: make this better for when we have stone.
    // for now, an easy hack to switch to the other scene.
    NavigationService.navigateToCards(SCENES[index].value);
  };

  selectedSceneHorizontalPosition: AnimatedValue;

  render() {
    const { scene: currentScene } = this.props;
    const renderedScenes = SCENES.map((scene, index) => (
      <View
        key={scene.value}
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
      >
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={() => this.toggleItem(index)}
        >
          <Text
            style={{
              fontSize: 20
            }}
          >
            {scene.label}
          </Text>
        </TouchableOpacity>
      </View>
    ));

    return (
      <View
        style={{
          flexDirection: 'row',
          width: WIDTH,
          borderRadius: 50,
          backgroundColor: Colors.Grey80,
          height: WIDTH / SCENES.length
        }}
      >
        <NavigationEvents
          onDidBlur={() => {
            this.animate(sceneIndex(currentScene) / SCENES.length);
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            borderColor: Colors.Grey80,
            borderRadius: 50,
            borderWidth: 0
          }}
        >
          <Animated.View
            style={[
              {
                position: 'absolute',
                height: '100%',
                backgroundColor: 'white',
                width: WIDTH / SCENES.length,
                transform: [
                  {
                    translateX: this.selectedSceneHorizontalPosition.interpolate(
                      {
                        inputRange: [0, 1],
                        outputRange: [0, WIDTH]
                      }
                    )
                  }
                ],
                borderRadius: 25,
                borderWidth: 2,
                borderColor: Colors.AquaMarine
              }
            ]}
          />
          {renderedScenes}
        </View>
      </View>
    );
  }
}
