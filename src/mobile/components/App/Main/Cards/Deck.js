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
import type { Node } from "react";
import type AnimatedValueXY from "react-native/Libraries/Animated/src/nodes/AnimatedValueXY";

export type CardType = {
  id: number,
  name: string
};

const RIGHT = "right";
const LEFT = "left";
type direction = "left" | "right";

type Props = {
  data: Array<CardType>,
  renderCard: (card: CardType) => Node,
  renderNoMoreCards: () => Node,
  onSwipeRight: (card: CardType) => void,
  onSwipeLeft: (card: CardType) => void,
  infinite: boolean
};

type State = {
  panResponder: any,
  position: AnimatedValueXY,
  index: number
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.4 * SCREEN_WIDTH;

export default class Deck extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this._forceSwipe(RIGHT);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this._forceSwipe(LEFT);
        } else {
          console.log("Swipe dismissed");
          this._resetPosition();
        }
      }
    });

    this.state = { panResponder, position, index: 0 };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  _forceSwipe(direction: direction) {
    const x = direction === RIGHT ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing(this.state.position, {
      toValue: { x: x * 2, y: direction === RIGHT ? -x : x },
      duration: 250
    }).start(() => this._onSwipeComplete(direction));
  }

  _onSwipeComplete(direction: direction) {
    const { onSwipeRight, onSwipeLeft, data } = this.props;
    const item = data[this.state.index];

    direction === RIGHT ? onSwipeRight(item) : onSwipeLeft(item);
    this.state.position.setValue({ x: 0, y: 0 });
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
      return this.props.renderNoMoreCards();
    }

    return this.props.data
      .map((item, i) => {
        if (i < this.state.index) {
          return null;
        } else if (i === this.state.index) {
          return (
            <Animated.View
              key={item.id}
              style={[this._getCardStyle(), styles.cardStyle]}
              {...this.state.panResponder.panHandlers}
            >
              {this.props.renderCard(item)}
            </Animated.View>
          );
        }

        return (
          <Animated.View key={item.id} style={styles.cardStyle}>
            {this.props.renderCard(item)}
          </Animated.View>
        );
      })
      .reverse();
  }

  render() {
    return <View>{this._renderCards()}</View>;
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    position: "absolute",
    width: SCREEN_WIDTH
  }
});
