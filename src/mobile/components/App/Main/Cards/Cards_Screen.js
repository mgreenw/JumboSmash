// @flow

import React from "react";
import {
  Text,
  View,
  TouchableWithoutFeeback,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Dimensions,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import { Button, Icon } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import Deck from "./Deck";
import type { swipeDirection } from "./Deck";
import type { UserProfile, Candidate } from "mobile/reducers";
import Card from "./Card";
import CustomIcon from "mobile/assets/icons/CustomIcon";

type Props = {
  navigation: any
};

type State = {
  isExpanded: boolean,
  swipeGestureInProgress: boolean
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

//TODO: remove b/c dummy
let DATA: Array<Candidate> = [
  {
    userId: 1,
    profile: { displayName: "Anthony", birthday: "21", bio: "BIO", images: [] }
  },
  {
    userId: 2,
    profile: { displayName: "Tony", birthday: "22", bio: "BIO", images: [] }
  },
  {
    userId: 3,
    profile: { displayName: "Ant", birthday: "69", bio: "BIO", images: [] }
  },
  {
    userId: 4,
    profile: { displayName: "T-dawg", birthday: "47", bio: "BIO", images: [] }
  }
];

class SwipingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isExpanded: false,
      swipeGestureInProgress: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    const isExpanded = navigation.getParam("isExpanded", false);
    return isExpanded
      ? {
          header: null
        }
      : {
          title: "Swiping",
          headerRight: (
            <CustomIcon
              name="icon-message"
              size={20}
              onPress={() => navigation.navigate(routes.Matches)}
            />
          ),
          headerLeft: (
            <CustomIcon
              name="icon-user"
              size={20}
              onPress={() => navigation.navigate(routes.Profile)}
            />
          ),
          headerStyle: {
            marginRight: 22,
            marginLeft: 22,
            borderBottomWidth: 0
          }
        };
  };

  _renderCard = (user: UserProfile, isTop: boolean) => {
    return (
      <Card
        user={user}
        isExpanded={isTop && this.state.isExpanded}
        onMinimize={() => {
          this.setState({ isExpanded: false });
        }}
      />
    );
  };

  _renderEmpty = () => {
    return <Text>Too picky</Text>;
  };

  _onSwipeStart = () => {
    // $FlowFixMe (__DEV__ will break flow)
    if (__DEV__) {
      console.log("swiping");
    }
  };

  _onSwipeRight = (user: Candidate) => {
    // $FlowFixMe (__DEV__ will break flow)
    if (__DEV__) {
      console.log("Card liked: " + user.profile.displayName);
    }
  };

  _onSwipeLeft = (user: Candidate) => {
    // $FlowFixMe (__DEV__ will break flow)
    if (__DEV__) {
      console.log("Card disliked: " + user.profile.displayName);
    }
  };

  _onSwipeComplete = () => {
    this.setState({ swipeGestureInProgress: false });
  };

  _onCardTap = () => {
    // $FlowFixMe (__DEV__ will break flow)
    if (__DEV__) {
      console.log("tapped");
    }
    this.setState({ isExpanded: true });
  };

  _onPressSwipeButton = (swipeDirection: swipeDirection) => {
    const { isExpanded, swipeGestureInProgress } = this.state;

    this.setState({ swipeGestureInProgress: true }, () => {
      if (isExpanded) {
        this.setState({ isExpanded: false }, () => {
          setTimeout(
            () => this.deck && this.deck._forceSwipe(swipeDirection, 750),
            250
          );
        });
      } else {
        this.deck && this.deck._forceSwipe(swipeDirection, 750);
      }
    });
  };

  _onSwipeLike = () => {
    this._onPressSwipeButton("right");
  };

  _onSwipeDislike = () => {
    this._onPressSwipeButton("left");
  };

  deck: ?Deck;

  render() {
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <Deck
          ref={deck => (this.deck = deck)}
          data={DATA}
          renderCard={this._renderCard}
          renderEmpty={this._renderEmpty}
          onSwipeStart={this._onSwipeStart}
          onSwipeRight={this._onSwipeRight}
          onSwipeLeft={this._onSwipeLeft}
          onSwipeComplete={this._onSwipeComplete}
          disableSwipe={this.state.isExpanded}
          onTap={this._onCardTap}
          infinite={true}
        />

        <TouchableHighlight
          disabled={this.state.swipeGestureInProgress}
          onPress={this._onSwipeDislike}
        >
          <Image
            source={{
              uri:
                "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
            }}
            style={styles.swipeButton_dislike}
          />
        </TouchableHighlight>
        <TouchableHighlight
          disabled={this.state.swipeGestureInProgress}
          onPress={this._onSwipeLike}
        >
          <Image
            source={{
              uri:
                "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
            }}
            style={styles.swipeButton_like}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const swipeButtonBase = {
  aspectRatio: 1,
  borderRadius: 30,
  height: 60,
  width: 60,
  position: "absolute",
  bottom: 20
};

const styles = StyleSheet.create({
  swipeButton_dislike: {
    ...swipeButtonBase,
    left: 100
  },
  swipeButton_like: {
    ...swipeButtonBase,
    right: 100
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwipingScreen);
