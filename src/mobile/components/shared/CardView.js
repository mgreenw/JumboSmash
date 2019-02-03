// @flow

import React from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Animated
} from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import { Button, Card as RneCard, Icon } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import type { UserProfile } from "mobile/reducers";
import { isIphoneX } from "mobile/utils/Platform";

type Props = {
  user: UserProfile,
  onMinimize: () => void
};

const { width } = Dimensions.get("window");

const photos = [
  {
    uri:
      "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
  },
  {
    uri:
      "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
  },
  {
    uri:
      "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
  },
  {
    uri:
      "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
  }
];

export default class CardView extends React.Component<Props> {
  scrollX = new Animated.Value(0); // this will be the scroll location of our ScrollView

  render() {
    const { user, onMinimize } = this.props;
    let position = Animated.divide(this.scrollX, width);
    return (
      <ScrollView
        style={{
          flex: 1
        }}
        contentInset={{ bottom: 40 }}
      >
        {isIphoneX() && (
          <View style={{ height: 40, backgroundColor: "#fff" }} />
        )}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ width, height: width }}>
            <ScrollView
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                // Animated.event returns a function that takes an array where the first element...
                [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
              )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
              scrollEventThrottle={16}
            >
              {photos.map((source, i) => {
                return (
                  <Image
                    key={i}
                    style={{ width, height: width }}
                    source={source}
                  />
                );
              })}
            </ScrollView>
          </View>
          <View style={{ flexDirection: "row" }}>
            {photos.map((_, i) => {
              let opacity = position.interpolate({
                inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
                outputRange: [0.4, 1, 0.4], // when position is not i, the opacity of the dot will animate to 0.4
                extrapolate: "clamp" // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.4)
              });
              return (
                <Animated.View
                  key={i}
                  style={{
                    opacity,
                    height: 8,
                    width: 8,
                    backgroundColor: "#cccccc",
                    margin: 8,
                    marginTop: -30,
                    borderRadius: 5
                  }}
                />
              );
            })}
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            marginTop: 0,
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

            <TouchableOpacity
              style={{ position: "absolute", right: 20, padding: 5 }}
              onPress={onMinimize}
            >
              <Text style={{ fontSize: 28 }}>{"<"}</Text>
            </TouchableOpacity>
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
