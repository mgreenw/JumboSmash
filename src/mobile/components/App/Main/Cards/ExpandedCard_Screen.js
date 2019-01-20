// @flow

import React from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import { Button, Card as RneCard, Icon } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import type { UserProfile } from "mobile/reducers";
import CardView from "mobile/components/shared/CardView";

type navigationProps = {
  navigation: any
};

type reduxProps = {};

type dispatchProps = {};

type Props = reduxProps & navigationProps & dispatchProps;

type State = { user: UserProfile, onMinimize: () => void };

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class Card extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      user: navigation.getParam("user", null),
      onMinimize: navigation.getParam("onMinimize", null)
    };
  }

  render() {
    const { user, onMinimize } = this.state;
    return <CardView user={user} onMinimize={onMinimize} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);
