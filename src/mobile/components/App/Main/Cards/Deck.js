// @flow

import React, { Component } from "react";
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  LayoutAnimation,
  UIManager
} from "react-native";
import type { AnimatedValueXY, Node } from "react-native";
import type { UserProfile } from "mobile/reducers";

const RIGHT = "right";
const LEFT = "left";
export type swipeDirection = "left" | "right";

type Props = {
  data: $ReadOnlyArray<UserProfile>,
  renderCard: (user: UserProfile, isTop: boolean) => Node,
  renderEmpty: () => Node,
  onSwipeStart: () => void,
  onSwipeRight: (user: UserProfile) => void,
  onSwipeLeft: (user: UserProfile) => void,
  onSwipeComplete: () => void,
  onTap: () => void,
  disableSwipe: boolean,
  infinite?: boolean
};

type State = {
  panResponder: any,
  position: AnimatedValueXY,
  index: number,
  slideGesture: boolean
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.4 * SCREEN_WIDTH;

export default class Deck extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetResponderCapture: () => true,
      onPanResponderMove: (_, gesture) => {
        if (this.props.disableSwipe) {
          return;
        }
        if (
          gesture.dx < -5 ||
          gesture.dx > 5 ||
          gesture.dy < -5 ||
          gesture.dy > 5
        ) {
          this.setState(
            {
              slideGesture: true
            },
            () => this.props.onSwipeStart()
          );
        }

        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (this.props.disableSwipe) {
          return;
        }
        if (gesture.dx > SWIPE_THRESHOLD) {
          this._forceSwipe(RIGHT, 500);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this._forceSwipe(LEFT, 500);
        } else {
          console.log("Swipe dismissed");
          this._resetPosition();
        }
        if (!this.state.slideGesture) {
          this.props.onTap();
        }

        this.setState({
          slideGesture: false
        });
      }
    });

    this.state = { panResponder, position, index: 0, slideGesture: false };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  _forceSwipe(swipeDirection: swipeDirection, duration: number) {
    const x = swipeDirection === RIGHT ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing(this.state.position, {
      toValue: { x: x * 2, y: swipeDirection === RIGHT ? -x : x },
      duration: duration
    }).start(() => this._onSwipeComplete(swipeDirection));
  }

  _onSwipeComplete(swipeDirection: swipeDirection) {
    const { onSwipeRight, onSwipeLeft, data } = this.props;
    const item = data[this.state.index];
    swipeDirection === RIGHT ? onSwipeRight(item) : onSwipeLeft(item);
    this.state.position.setValue({ x: 0, y: 0 });
    this.props.onSwipeComplete();
    this.setState({ index: this.state.index + 1 });
  }

  _resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  _getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
      outputRange: ["-30deg", "0deg", "30deg"]
    });

    return {
      ...this.state.position.getLayout(),
      transform: [{ rotate }]
    };
  }

  _renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderEmpty();
    }

    return this.props.data
      .map((item, i) => {
        if (i < this.state.index) {
          return null;
        } else if (i === this.state.index && !this.props.disableSwipe) {
          return (
            <Animated.View
              //key={item.id}
              style={[this._getCardStyle(), styles.cardStyle]}
              {...this.state.panResponder.panHandlers}
            >
              {this.props.renderCard(item, true)}
            </Animated.View>
          );
        }

        return (
          <View /*key={item.id}*/ style={styles.cardStyle}>
            {this.props.renderCard(item, i === this.state.index)}
          </View>
        );
      })
      .reverse();
  }

  render() {
    return (
      <View style={{ position: "relative", flex: 1 }}>
        {this._renderCards()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    position: "absolute",
    width: "100%"
  }
});
