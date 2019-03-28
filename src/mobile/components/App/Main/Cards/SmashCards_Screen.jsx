// @flow

import React from 'react';
import type { Scene } from 'mobile/reducers';
import CardsLayout from './Cards_Layout';

const SCENE: Scene = 'smash';
const SmashCards = () => {
  return <CardsLayout scene={SCENE} />;
};
export default SmashCards;
