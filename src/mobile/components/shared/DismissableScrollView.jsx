import React from 'react';
import { Dimensions, Animated, Easing, Platform } from 'react-native';

type Props = {
  children: React.node,
  onSwipeComplete: () => void
};

type State = {
  cardLocation: Animated.value
};

// 0 to account for no overscroll on android
const onSwipeDownThreshold = Platform.OS === 'android' ? 0 : -200;

export default class DismissableScrollview extends React.Component<
  Props,
  State
> {
  constructor() {
    super();

    this.state = {
      cardLocation: new Animated.Value(Dimensions.get('screen').height)
    };

    const { cardLocation } = this.state;

    Animated.timing(cardLocation, {
      duration: 250,
      easing: Easing.inOut(Easing.quad),
      toValue: 0,
      delay: 0,
      useNativeDriver: true
    }).start();

    this._startDragValue = 0;
  }

  _onScrollBeginDrag = e => {
    this._startDragValue = e.nativeEvent.contentOffset.y;
  };

  _onScrollEndDrag = e => {
    const { onSwipeComplete } = this.props;
    if (Platform.OS === 'android' && this._startDragValue >= 5) return;
    if (
      e.nativeEvent.contentOffset.y <= onSwipeDownThreshold ||
      (e.nativeEvent.velocity.y <= -0.5 &&
        e.nativeEvent.contentOffset.y <= onSwipeDownThreshold / 4)
    ) {
      this.animateAway(() => {
        onSwipeComplete();
      });
    }
  };

  animateAway(onCompleteCb = () => {}) {
    const { cardLocation } = this.state;
    Animated.timing(cardLocation, {
      toValue: Dimensions.get('screen').height,
      easing: Easing.out(Easing.quad),
      duration: 100,
      delay: 0,
      useNativeDriver: true
    }).start(onCompleteCb);
  }

  render() {
    const { cardLocation } = this.state;
    const { children } = this.props;
    return (
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScrollBeginDrag={this._onScrollBeginDrag}
        onScrollEndDrag={this._onScrollEndDrag}
        alwaysBounceVertical
        style={{
          top: 0,
          left: 0,
          right: 0,
          position: 'absolute',
          height: Dimensions.get('window').height,
          backgroundColor: 'transparent',
          transform: [
            {
              translateY: cardLocation
            }
          ]
        }}
      >
        {children}
      </Animated.ScrollView>
    );
  }
}
