// @flow

import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import { Button, Card, Icon } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import Deck from "./Deck";
import type { CardType } from "./Deck";

type Props = {
  navigation: any
};

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

const DATA = [
  { id: 1, name: "Dan1" },
  { id: 2, name: "Dan2" },
  { id: 3, name: "Dan3" },
  { id: 4, name: "Dan4" }
];

class SwipingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = ({ navigation }) => {
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

  renderCard(card: CardType) {
    return (
      <Card
        containerStyle={{
          borderRadius: 10,
          padding: 20
        }}
        title={card.name}
        image={{
          uri:
            "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
        }}
      />
    );
  }

  renderNoMoreCards() {
    return (
      <Card
        containerStyle={{
          borderRadius: 10,
          padding: 20
        }}
        title="Too picky"
      />
    );
  }

  onSwipeRight(card: CardType) {
    console.log("Card liked: " + card.name);
  }

  onSwipeLeft(card: CardType) {
    console.log("Card disliked: " + card.name);
  }

  render() {
    return (
      <View>
        <Deck
          data={DATA}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
          onSwipeRight={this.onSwipeRight}
          onSwipeLeft={this.onSwipeLeft}
          infinite={true}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwipingScreen);
