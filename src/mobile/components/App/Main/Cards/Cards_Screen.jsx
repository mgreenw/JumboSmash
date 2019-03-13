// @flow

import React from 'react';
import { View } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import type { Scene } from 'mobile/reducers';
import CardDeck from './CardDeck';
import SceneSelector from './SceneSelector';

type NavigationProps = {
  navigation: any
};

type Props = NavigationProps;

type State = {
  currentScene: Scene
};

export default class SwipingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentScene: 'smash'
    };
  }

  render() {
    const { currentScene } = this.state;
    const sceneSelector = (
      <SceneSelector startIndex={1} onPress={() => {}} disabled={false} />
    );

    return (
      <Transition inline appear="scale">
        <View style={{ flex: 1 }}>
          <GEMHeader
            title="PROJECTGEM"
            rightIconName="message"
            leftIconName="user"
            centerComponent={sceneSelector}
          />
          <View style={{ backgroundColor: 'white', flex: 1 }}>
            {currentScene === 'smash' && <CardDeck scene={'smash'} />}
          </View>
        </View>
      </Transition>
    );
  }
}
