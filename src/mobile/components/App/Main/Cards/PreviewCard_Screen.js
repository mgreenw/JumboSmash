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

type Props = {
  navigation: any,
  user: UserProfile,
  onPress?: () => void
};

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class Card extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, onPress } = this.props;
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={{
            flex: 1,
            margin: 20
          }}
        >
          <View style={{ flex: 2 }}>
            <Image
              source={{
                uri:
                  "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
              }}
              style={{
                aspectRatio: 1,
                borderRadius: 20
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              padding: 20,
              alignItems: "center",
              marginTop: -30,
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 20,
              shadowOffset: { width: 1, height: 2 },
              shadowColor: "black",
              shadowOpacity: 0.2
            }}
          >
            <Text style={{ fontSize: 28 }}>{`${user.displayName}, ${
              user.birthday
            }`}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);
