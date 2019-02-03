// @flow

import React from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Dimensions,
  Animated
} from "react-native";
import { connect } from "react-redux";
import { styles } from "mobile/styles/template";
import { Button, Card as RneCard, Icon } from "react-native-elements";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import type { UserProfile } from "mobile/reducers";

type Props = {
  user: UserProfile,
  onMinimize: () => void
};

type State = {};

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

export default class CardView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
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
        {/*<View style={{ flex: 1 }}>
          <Image
            source={{
              uri:
                "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
            }}
            style={{
              aspectRatio: 1
            }}
          />
        </View>*/}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            // this will bound the size of the ScrollView to be a square because
            // by default, it will expand regardless if it has a flex value or not
            style={{ width, height: width }}
          >
            <ScrollView
              horizontal={true}
              pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
              showsHorizontalScrollIndicator={false}
              // the onScroll prop will pass a nativeEvent object to a function
              onScroll={Animated.event(
                // Animated.event returns a function that takes an array where the first element...
                [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
              )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
              scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
            >
              {photos.map((source, i) => {
                // for every object in the photos array...
                return (
                  // ... we will return a square Image with the corresponding object as the source
                  <Image
                    key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                    style={{ width, height: width }}
                    source={source}
                  />
                );
              })}
            </ScrollView>
          </View>
          <View
            style={{ flexDirection: "row" }} // this will layout our dots horizontally (row) instead of vertically (column)
          >
            {photos.map((_, i) => {
              // the _ just means we won't use that parameter
              let opacity = position.interpolate({
                inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
                outputRange: [0.4, 1, 0.4], // when position is not i, the opacity of the dot will animate to 0.3
                // inputRange: [i - 0.50000000001, i - 0.5, i, i + 0.5, i + 0.50000000001], // only when position is ever so slightly more than +/- 0.5 of a dot's index
                // outputRange: [0.3, 1, 1, 1, 0.3], // is when the opacity changes from 1 to 0.3
                extrapolate: "clamp" // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
              });
              return (
                <Animated.View // we will animate the opacity of the dots so use Animated.View instead of View here
                  key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                  style={{
                    opacity,
                    height: 10,
                    width: 10,
                    backgroundColor: "#595959",
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
