// @flow

import React from "react";
import { Text, View, TouchableWithoutFeedback, Dimensions } from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import { Button, Card as RneCard, Icon } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import type { CardType } from "./Deck";

type Props = {
  navigation: any,
  card: CardType,
  isExpanded: boolean
};

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class Card extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isExpanded: false
    };
  }

  _renderNotExpanded() {
    const { card } = this.props;
    return (
      <RneCard
        containerStyle={{
          borderRadius: 10,
          padding: 20
        }}
        title={card.name}
        image={{
          uri:
            "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
        }}
        imageStyle={{
          aspectRatio: 1
        }}
      />
    );
  }

  _renderExpanded() {
    const { card } = this.props;
    return (
      <RneCard
        containerStyle={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          margin: 0
        }}
        title={card.name}
        image={{
          uri:
            "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
        }}
        imageStyle={{
          aspectRatio: 1
        }}
      />
    );
  }

  render() {
    const { isExpanded } = this.props;
    let renderedCard;
    if (isExpanded) {
      renderedCard = this._renderExpanded();
    } else {
      renderedCard = this._renderNotExpanded();
    }

    return <View>{renderedCard}</View>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);
