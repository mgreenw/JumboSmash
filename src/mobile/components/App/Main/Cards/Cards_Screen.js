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
import type { UserProfile } from "mobile/reducers";
import Card from "./Card";

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
let DATA: Array<UserProfile> = [
  { userId: 1, displayName: "Anthony", birthday: "21", bio: "BIO", images: [] },
  { userId: 2, displayName: "Tony", birthday: "22", bio: "BIO", images: [] },
  { userId: 3, displayName: "Ant", birthday: "69", bio: "BIO", images: [] },
  { userId: 4, displayName: "T-dawg", birthday: "47", bio: "BIO", images: [] }
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
            <Icon
              name="send"
              type="font-awesome"
              size={40}
              onPress={() => navigation.navigate("Matches")}
              containerStyle={{ paddingRight: 10 }}
            />
          ),
          headerLeft: (
            <Icon
              name="user"
              type="font-awesome"
              size={40}
              onPress={() => navigation.navigate(routes.Profile)}
              containerStyle={{ paddingLeft: 10 }}
            />
          )
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
    console.log("swiping");
  };

  _onSwipeRight = (user: UserProfile) => {
    console.log("Card liked: " + user.displayName);
  };

  _onSwipeLeft = (user: UserProfile) => {
    console.log("Card disliked: " + user.displayName);
  };

  _onSwipeComplete = () => {
    this.setState({ swipeGestureInProgress: false });
  };

  _onCardTap = () => {
    console.log("tapped");
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
