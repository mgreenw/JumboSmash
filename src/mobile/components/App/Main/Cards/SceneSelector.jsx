// @flow

import React, { Component } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type { Scene } from 'mobile/reducers';
import { Colors } from 'mobile/styles/colors';

type Props = {
  startIndex: number,
  onPress: (scene: Scene) => void
};

const SCENES = [
  { label: '🐘', value: 'social' },
  { label: '🍑', value: 'smash' }
];

const WIDTH = 40 * SCENES.length;

export default class SceneSelector extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.selectedSceneHorizontalPosition = new Animated.Value(
      props.startIndex / SCENES.length
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
    const { onPress } = this.props;
    this.animate(index / SCENES.length);
    onPress(SCENES[index].value);
  };

  selectedSceneHorizontalPosition: AnimatedValue;

  render() {
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
