// @flow

import React from 'react';
import type { Scene } from 'mobile/reducers';
import CardsLayout from './Cards_Layout';

const SCENE: Scene = 'stone';
const StoneCards = () => {
  return <CardsLayout scene={SCENE} />;
};
export default StoneCards;
