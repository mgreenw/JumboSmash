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
import moment from "moment";
import { styles } from "mobile/styles/template";
import { Button, Card as RneCard, Icon } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import type { UserProfile } from "mobile/reducers";

type Props = {
  navigation: any,
  user: UserProfile,
  isExpanded: boolean,
  onMinimize: () => void
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

  _renderNotExpanded() {
    const { user } = this.props;
    debugger;
    return (
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
          <Text style={{ fontSize: 28 }}>{`${user.displayName}, ${moment().diff(
            moment(user.birthday),
            "years"
          )}`}</Text>
        </View>
      </View>
    );
  }

  _renderExpanded() {
    const { user } = this.props;
    return (
      <ScrollView
        style={{
          flex: 1
        }}
        contentInset={{ bottom: 40 }}
      >
        <View style={{ flex: 1 }}>
          <Image
            source={{
              uri:
                "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
            }}
            style={{
              aspectRatio: 1
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",

            alignItems: "center",
            marginTop: -10,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 10
          }}
        >
          <View
            style={{
              width: "100%",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            <Text style={{ fontSize: 28, textAlign: "center" }}>{`${
              user.displayName
            }, ${user.birthday}`}</Text>

            <TouchableHighlight
              style={{ position: "absolute", right: 20, padding: 5 }}
              onPress={this.props.onMinimize}
            >
              <Text style={{ fontSize: 28 }}>{"<"}</Text>
            </TouchableHighlight>
          </View>
          <Text>{user.bio}</Text>
        </View>
      </ScrollView>
    );
  }

  render() {
    return this.props.isExpanded
      ? this._renderExpanded()
      : this._renderNotExpanded();
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);
