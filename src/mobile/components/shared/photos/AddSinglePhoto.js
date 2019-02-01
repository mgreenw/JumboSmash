// @flow
import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { Icon } from "react-native-elements";
import { Colors } from "mobile/styles/colors";
import { textStyles } from "mobile/styles/textStyles";
import CustomIcon from "mobile/assets/icons/CustomIcon";
import { GET_PHOTO__ROUTE } from "mobile/api/routes";

type Props = {
  onAdd?: () => void,
  onRemove?: () => void,
  enableRemove: boolean,
  width: number,
  photoId: ?number,
  token: ?string
};

class AddSinglePhoto extends React.Component<Props> {
  render() {
    const { onAdd, onRemove, width, photoId, token, enableRemove } = this.props;
    return (
      <View>
        <TouchableOpacity
          style={{
            width: width,
            height: width,
            backgroundColor: Colors.Ice,
            aspectRatio: 1,
            borderColor: Colors.AquaMarine,
            borderWidth: photoId ? 0 : 2,
            borderStyle: "dashed",
            borderRadius: 3,
            alignItems: "center",
            justifyContent: "center"
          }}
          disabled={false}
          onPress={photoId ? null : onAdd}
        >
          {photoId ? (
            <Image
              style={{
                flex: 1,
                height: width,
                width: width,
                borderRadius: 8
              }}
              resizeMode="contain"
              loadingStyle={{ size: "large", color: "blue" }}
              source={{
                uri: GET_PHOTO__ROUTE + photoId,
                headers: {
                  Authorization: token
                }
              }}
            />
          ) : (
            <Text style={textStyles.headline6Style}>
              {photoId ? "" : "add"}
            </Text>
          )}
        </TouchableOpacity>
        {enableRemove && photoId ? (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: -8,
              top: -8,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={onRemove}
          >
            <View
              style={{
                backgroundColor: Colors.White,
                width: 20,
                height: 20,
                position: "absolute"
              }}
            />
            <CustomIcon
              size={30}
              color={Colors.Offblack}
              name="delete-filled"
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

export { AddSinglePhoto };
