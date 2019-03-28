// @flow

import React from 'react';
import type { Scene } from 'mobile/reducers';
import CardsLayout from './Cards_Layout';

const SCENE: Scene = 'social';
const SocialCards = () => {
  return <CardsLayout scene={SCENE} />;
};
export default SocialCards;
