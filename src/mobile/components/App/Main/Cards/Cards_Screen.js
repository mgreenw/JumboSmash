// @flow

import React from "react";
import {
  Text,
  View,
  TouchableWithoutFeeback,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import { Button, Icon } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { routes } from "mobile/components/Navigation";
import Deck from "./Deck";
import type { CardType } from "./Deck";
import Card from "./Card";

type Props = {
  navigation: any
};

type State = {
  isExpanded: boolean
};

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
    this.state = {
      isExpanded: false
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

  _renderCard = (card: CardType) => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity onPress={this._onCardPress}>
        <Card
          card={card}
          isExpanded={navigation.getParam("isExpanded", false)}
        />
      </TouchableOpacity>
    );
  };

  _renderEmpty = () => {
    return (
      <Card
        containerStyle={{
          borderRadius: 10,
          padding: 20
        }}
        title="Too picky"
      />
    );
  };

  _onSwipeRight = (card: CardType) => {
    console.log("Card liked: " + card.name);
  };

  _onSwipeLeft = (card: CardType) => {
    console.log("Card disliked: " + card.name);
  };

  render() {
    return (
      <View>
        <Deck
          data={DATA}
          renderCard={this._renderCard}
          renderEmpty={this._renderEmpty}
          onSwipeRight={this._onSwipeRight}
          onSwipeLeft={this._onSwipeLeft}
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
