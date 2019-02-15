// @flow
/* eslint react/no-unused-state: 0 */

import * as React from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet
} from 'react-native';
import type { AnimatedValueXY, Node } from 'react-native';
import type { UserProfile, Candidate } from 'mobile/reducers';
import DevTesting from 'mobile/utils/DevTesting';

const RIGHT = 'right';
const LEFT = 'left';
export type SwipeDirection = 'left' | 'right';

type Props = {
  data: Candidate[],
  renderCard: (profile: UserProfile, isTop: boolean) => Node,
  renderEmpty: () => Node,
  onSwipeStart: () => void,
  onSwipeRight: (user: Candidate) => void,
  onSwipeLeft: (user: Candidate) => void,
  onSwipeComplete: () => void,
  disableSwipe: boolean,
  infinite?: boolean
};

type State = {
  panResponder: any,
  position: AnimatedValueXY,
  index: number,
  swipeGestureInProgress: boolean
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.4 * SCREEN_WIDTH;
const TAP_THRESHOLD = 5;

const styles = StyleSheet.create({
  cardStyle: {
    position: 'absolute',
    width: '100%'
  }
});

export default class Deck extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetResponderCapture: () => true,
      onPanResponderMove: (_, gesture) => {
        // If the deck should not be swipeable then return
        if (props.disableSwipe) {
          return;
        }
        // If the magnitude of the distance of the gesture is greater than the tap threshold
        // then the user is swiping
        if (
          gesture.dx < -TAP_THRESHOLD ||
          gesture.dx > TAP_THRESHOLD ||
          gesture.dy < -TAP_THRESHOLD ||
          gesture.dy > TAP_THRESHOLD
        ) {
          this.setState(
            {
              swipeGestureInProgress: true
            },
            () => props.onSwipeStart()
          );
        }
        // set the position of the card to the position of the gesture
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        // If the deck should not be swipeable then return
        if (props.disableSwipe) {
          return;
        }

        // If the magnitude of the distance of the gesture is greater than trigger the swipe animation
        // otherwise reset the card to the original position
        if (gesture.dx > SWIPE_THRESHOLD) {
          this._forceSwipe(RIGHT, 500);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this._forceSwipe(LEFT, 500);
        } else {
          DevTesting.log('Swipe dismissed');
          this._resetPosition();
        }

        // The gesture is over so reset to false
        this.setState({
          swipeGestureInProgress: false
        });
      }
    });

    this.state = {
      panResponder,
      position,
      index: 0,
      swipeGestureInProgress: false
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const { data } = this.props;
    if (nextProps.data !== data) {
      this.setState({ index: 0 });
    }
  }

  _forceSwipe(swipeDirection: SwipeDirection, duration: number) {
    const { position } = this.state;
    const x = swipeDirection === RIGHT ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing(position, {
      toValue: { x: x * 2, y: swipeDirection === RIGHT ? -x : x },
      duration
    }).start(() => this._onSwipeComplete(swipeDirection));
  }

  _onSwipeComplete(swipeDirection: SwipeDirection) {
    const { onSwipeRight, onSwipeLeft, onSwipeComplete, data } = this.props;
    const { index, position } = this.state;
    const item = data[index];
    if (swipeDirection === RIGHT) {
      onSwipeRight(item);
    } else {
      onSwipeLeft(item);
    }
    position.setValue({ x: 0, y: 0 });
    onSwipeComplete();
    this.setState({ index: index + 1 });
  }

  _resetPosition() {
    const { position } = this.state;
    Animated.spring(position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  _getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
      outputRange: ['-30deg', '0deg', '30deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }

  // @flow-disable
  _renderCards(): React.Node[] {
    const { disableSwipe, renderCard, renderEmpty, data } = this.props;
    const { index, panResponder } = this.state;
    if (index >= data.length) {
      return renderEmpty();
    }

    return data
      .map((user, i) => {
        if (i < index) {
          return null;
        }
        if (i === index && !disableSwipe) {
          return (
            <Animated.View
              key={user.userId}
              style={[this._getCardStyle(), styles.cardStyle]}
              {...panResponder.panHandlers}
            >
              {renderCard(user.profile, true)}
            </Animated.View>
          );
        }

        return (
          <View key={user.userId} style={styles.cardStyle}>
            {renderCard(user.profile, i === index)}
          </View>
        );
      })
      .reverse();
  }

  render() {
    return (
      <View style={{ position: 'relative', flex: 1 }}>
        {this._renderCards()}
      </View>
    );
  }
}
