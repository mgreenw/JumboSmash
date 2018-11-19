// @flow

import React from "react";
import {
  Text,
  View,
  TouchableWithoutFeeback,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import { Button, Icon } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import Deck from "./Deck";
import type { CardType, direction } from "./Deck";
import Card from "./Card";

type Props = {
  navigation: any
};

type State = {
  isExpanded: boolean,
  isSwiping: boolean
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

let DATA = [
  { id: 1, name: "Anthony", age: 21 },
  { id: 2, name: "Tony", age: 22 },
  { id: 3, name: "Ant", age: 69 },
  { id: 4, name: "T-dawg", age: 47 }
];

let count = 5;

const SCREEN_HEIGHT = Dimensions.get("window").height;

class SwipingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isExpanded: false,
      isSwiping: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    const isExpanded = navigation.getParam("isExpanded", false);
    if (isExpanded) {
      return {
        header: null
      };
    }
    return {
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

  _onCardPress = () => {
    const { navigation } = this.props;
    const isExpanded = navigation.getParam("isExpanded", false);
    navigation.setParams({ isExpanded: !isExpanded });
  };

  _renderCard = (card: CardType, isTop: boolean) => {
    return (
      <Card
        card={card}
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

  _onSwipeRight = (card: CardType) => {
    console.log("Card liked: " + card.name);
  };

  _onSwipeLeft = (card: CardType) => {
    console.log("Card disliked: " + card.name);
  };

  _onSwipeComplete = () => {
    this.setState({ isSwiping: false });
  };

  _onCardTap = () => {
    console.log("tapped");
    this.setState({ isExpanded: true });
  };

  _onPressSwipeButton = (direction: direction) => {
    const { isExpanded, isSwiping } = this.state;
    if (isSwiping) {
      return;
    } else {
      this.setState({ isSwiping: true }, () => {
        if (isExpanded) {
          this.setState({ isExpanded: false }, () => {
            setTimeout(() => this.deck._forceSwipe(direction, 750), 250);
          });
        } else {
          this.deck._forceSwipe(direction, 750);
        }
      });
    }
  };

  deck: Deck;

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

        <TouchableHighlight onPress={() => this._onPressSwipeButton("left")}>
          <Image
            source={{
              uri:
                "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
            }}
            style={{
              aspectRatio: 1,
              borderRadius: 30,
              height: 60,
              width: 60,
              position: "absolute",
              bottom: 20,
              left: 100
            }}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this._onPressSwipeButton("right")}>
          <Image
            source={{
              uri:
                "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
            }}
            style={{
              aspectRatio: 1,
              borderRadius: 30,
              height: 60,
              width: 60,
              position: "absolute",
              bottom: 20,
              right: 100
            }}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwipingScreen);
