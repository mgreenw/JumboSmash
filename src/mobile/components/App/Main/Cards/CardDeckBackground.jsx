// @flow

import React from 'react';
import { View, Image, Dimensions, Text } from 'react-native';
import { textStyles } from 'mobile/styles/textStyles';
import type { Scene } from 'mobile/reducers';

const ArthurLoadingGif = require('../../../../assets/arthurLoading.gif');
const ArthurLoadingFrame1 = require('../../../../assets/arthurLoadingFrame1.png');

/**
 * Animate typically will be the same as getCandidatesInProgress,
 * but is different when we need to transition out of the view.
 */
type ProppyProps = {
  animate: boolean,
  noCandidates: boolean,
  getCandidatesInProgress: boolean,
  scene: Scene
};

export default ({
  animate,
  noCandidates,
  getCandidatesInProgress,
  scene
}: ProppyProps) => {
  const { width: windowWidth } = Dimensions.get('window');
  return (
    <View
      /* Wrapping view so we can offset the button */
      style={{
        flex: 1
      }}
    >
      <View
        /* Inner view to center align content */
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            paddingHorizontal: '10.1%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text
            style={[
              textStyles.headline4StyleSwiping,
              {
                opacity: noCandidates && !getCandidatesInProgress ? 1 : 0,
                marginVertical: '10.1%'
              }
            ]}
          >
            {scene === 'smash'
              ? 'Someone’s good\nwith their hands ;)'
              : "Someone's swipe-happy :)"}
          </Text>
        </View>
        <View
          style={{
            width: windowWidth,
            height: windowWidth,
            zIndex: -2,
            marginVertical: -windowWidth / 3
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}
            source={ArthurLoadingFrame1}
          />
          {animate && (
            <Image
              resizeMode="contain"
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute'
              }}
              source={ArthurLoadingGif}
            />
          )}
        </View>
        <View
          style={{
            paddingHorizontal: '10.1%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text
            style={[
              textStyles.subtitle1Style,
              {
                opacity: noCandidates && !getCandidatesInProgress ? 1 : 0,
                marginVertical: '10.1%'
              }
            ]}
          >
            Looks like you’ve swiped through everyone in your stack. Refresh it
            to see the people you swiped left on.
          </Text>
        </View>
      </View>
      {/* The button can't live here, because it needs to be at the top level view. 
          However, we need to make space for it still */}
      <View
        style={{
          height: 40,
          width: '100%'
        }}
      />
    </View>
  );
};
