// @flow

import React from 'react';
import { View } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import type { Scene } from 'mobile/reducers';
import CardDeck from './CardDeck';
import SceneSelector from './SceneSelector';

type Props = {
  scene: Scene
};

const CardsLayout = (props: Props) => {
  const { scene } = props;
  const sceneSelector = <SceneSelector scene={scene} />;
  return (
    <View style={{ flex: 1 }}>
      <GEMHeader
        title="PROJECTGEM"
        rightIconName="message"
        leftIconName="user"
        centerComponent={sceneSelector}
      />
      <Transition inline appear="scale">
        <View
          style={{
            backgroundColor: 'white',
            flex: 1
          }}
        >
          <CardDeck scene={scene} />
        </View>
      </Transition>
    </View>
  );
};

export default CardsLayout;
