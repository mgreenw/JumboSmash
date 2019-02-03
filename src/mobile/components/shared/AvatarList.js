// @flow
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { textStyles } from "mobile/styles/textStyles";
import { Avatar, ListItem } from "react-native-elements";
import { Colors } from "mobile/styles/colors";

type Props = {};

const list = [
  {
    name: "Amy Farha",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
    subtitle: "Vice President"
  },
  {
    name: "Chris Jackson",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    subtitle: "Vice Chairman"
  }
];

export class AvatarList extends React.Component<Props> {
  render() {
    const dummyAvatar = (
      <View
        style={{
          flex: 1,
          marginHorizontal: 5,
          borderWidth: 4,
          borderRadius: 100,
          borderColor: Colors.AquaMarine
        }}
      >
        <Avatar
          size="large"
          rounded
          source={{
            uri:
              "https://president.tufts.edu/wp-content/uploads/PresMonaco_Sept2011.jpg"
          }}
        />
      </View>
    );
    return (
      <View>
        <View>
          <Text style={[textStyles.subtitle1Style, { paddingLeft: 15 }]}>
            {"New Matches"}
          </Text>
          <ScrollView
            style={{ paddingTop: 12, paddingBottom: 12 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {dummyAvatar}
            {dummyAvatar}
            {dummyAvatar}
            {dummyAvatar}
            {dummyAvatar}
            {dummyAvatar}
            {dummyAvatar}
            {dummyAvatar}
            {dummyAvatar}
          </ScrollView>
          <Text style={[textStyles.subtitle1Style, { paddingLeft: 15 }]}>
            {"Messages"}
          </Text>
        </View>
      </View>
    );
  }
}
