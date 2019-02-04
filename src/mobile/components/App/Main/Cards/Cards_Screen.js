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
import PreviewCard from "mobile/components/shared/PreviewCard";
import { textStyles } from "mobile/styles/textStyles";
import { Transition } from "react-navigation-fluid-transitions";
import GEMHeader from "mobile/components/shared/Header";
import NavigationService from "mobile/NavigationService";
import DevTesting from "mobile/utils/DevTesting";

type navigationProps = {
  navigation: any
};

type reduxProps = {};

type dispatchProps = {};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {
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
    profile: {
      displayName: "Anthony",
      birthday: "21",
      bio: "BIO",
      photoIds: []
    }
  },
  {
    userId: 2,
    profile: { displayName: "Tony", birthday: "22", bio: "BIO", photoIds: [] }
  },
  {
    userId: 3,
    profile: { displayName: "Ant", birthday: "69", bio: "BIO", photoIds: [] }
  },
  {
    userId: 4,
    profile: { displayName: "T-dawg", birthday: "47", bio: "BIO", photoIds: [] }
  }
];

class SwipingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      swipeGestureInProgress: false
    };
  }

  _renderCard = (user: UserProfile, isTop: boolean) => {
    const { navigation } = this.props;
    return (
      <PreviewCard
        user={user}
        onCardTap={() =>
          navigation.navigate(routes.ExpandedCard, {
            user,
            onMinimize: () => navigation.pop()
          })
        }
      />
    );
  };

  _renderEmpty = () => {
    return <Text>Too picky</Text>;
  };

  _onSwipeStart = () => {
    DevTesting.log("swiping");
  };

  _onSwipeRight = (user: Candidate) => {
    DevTesting.log("Card liked: " + user.profile.displayName);
  };

  _onSwipeLeft = (user: Candidate) => {
    DevTesting.log("Card disliked: " + user.profile.displayName);
  };

  _onSwipeComplete = () => {
    this.setState({ swipeGestureInProgress: false });
  };

  _onPressSwipeButton = (swipeDirection: swipeDirection) => {
    const { swipeGestureInProgress } = this.state;

    if (this.deck) {
      this.setState({ swipeGestureInProgress: true }, () => {
        this.deck && this.deck._forceSwipe(swipeDirection, 750);
      });
    }
  };

  _onSwipeLike = () => {
    this._onPressSwipeButton("right");
  };

  _onSwipeDislike = () => {
    this._onPressSwipeButton("left");
  };

  deck: ?Deck;

  render() {
    const { navigation } = this.props;
    return (
      <Transition inline appear={"scale"}>
        <View style={{ flex: 1 }}>
          <GEMHeader
            title="cards"
            rightIconName="message"
            leftIconName="user"
          />
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
              infinite={true}
              disableSwipe={false}
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
        </View>
      </Transition>
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
