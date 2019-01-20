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
  navigation: any
};

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
              onPress={onMinimize}
            >
              <Text style={{ fontSize: 28 }}>{"<"}</Text>
            </TouchableHighlight>
          </View>
          <Text>
            {
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed vehicula urna, in fringilla ipsum. Aenean non lorem quis lorem sollicitudin consequat. Donec tempor erat in ipsum ornare, eu aliquet orci egestas. Vestibulum a convallis metus. Morbi faucibus in orci quis lacinia. Quisque auctor dictum neque, id finibus odio porta in. Suspendisse eget elementum nisl. Vivamus nec massa at dui porta congue. Cras aliquet nunc et elit sodales viverra. Donec elementum semper scelerisque."
            }
          </Text>
        </View>
      </ScrollView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);
