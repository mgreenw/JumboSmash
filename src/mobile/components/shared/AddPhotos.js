// @flow
import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert
} from "react-native";
import { Icon } from "react-native-elements";
import { Colors } from "mobile/styles/colors";
import { textStyles } from "mobile/styles/textStyles";
import CustomIcon from "mobile/assets/icons/CustomIcon";
import { Permissions, ImagePicker } from "expo";

const MAX_PHOTO_URI =
  "https://scontent.fbed1-2.fna.fbcdn.net/v/t1.0-9/12105723_941787282524951_8320224109759059077_n.jpg?_nc_cat=111&_nc_ht=scontent.fbed1-2.fna&oh=cd25f407f14176cc15e66bd291e3fa3d&oe=5CC58760";
type ProfilePcitureProps = {
  disabled: boolean,
  showDeleteButton: boolean,
  uri: ?string,
  onAdd?: () => void,
  onRemove?: () => void,
  imageWidth: number
};
class ProfilePciture extends React.Component<ProfilePcitureProps> {
  render() {
    const {
      uri,
      disabled,
      onAdd,
      showDeleteButton,
      onRemove,
      imageWidth
    } = this.props;
    return (
      <View style={{ opacity: disabled ? 0.2 : 1 }}>
        <TouchableOpacity
          style={{
            width: imageWidth,
            height: imageWidth,
            backgroundColor: Colors.Ice,
            aspectRatio: 1,
            borderColor: Colors.AquaMarine,
            borderWidth: uri ? 0 : 2,
            borderStyle: "dashed",
            borderRadius: 3,
            alignItems: "center",
            justifyContent: "center"
          }}
          disabled={disabled}
          onPress={uri ? null : onAdd}
        >
          {uri ? (
            <Image
              style={{
                flex: 1,
                height: imageWidth,
                width: imageWidth,
                borderRadius: 8
              }}
              resizeMode="contain"
              loadingStyle={{ size: "large", color: "blue" }}
              source={{ uri: uri ? uri : "" }}
            />
          ) : (
            <Text style={textStyles.headline6Style}>
              {disabled ? "" : "add"}
            </Text>
          )}
        </TouchableOpacity>
        {showDeleteButton && uri ? (
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

type AddPhotosProps = {
  images: $ReadOnlyArray<?string>,
  enableDeleteFirst?: boolean,
  onChangeImages: ($ReadOnlyArray<?string>) => void,
  imageWidth: number,
  width: number
};

async function selectPhoto() {
  const { status, permissions } = await Permissions.askAsync(
    Permissions.CAMERA_ROLL
  );
  if (status === "granted") {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1]
    });

    console.log(result);
    return result.uri;
  } else {
    Alert.alert("Please enable camera roll access to proceed.");
  }
}

export default class AddPhotos extends React.Component<AddPhotosProps> {
  _onAdd = async (index: number, uri: string) => {
    const newUri = await selectPhoto();

    const newImages = this.props.images.slice();
    newImages[index] = newUri;
    this.props.onChangeImages(newImages);
  };

  _onRemove = (index: number) => {
    const newImages = this.props.images.slice();
    newImages.splice(index, 1);
    newImages[3] = null;
    this.props.onChangeImages(newImages);
  };

  render() {
    const { images, enableDeleteFirst, imageWidth, width } = this.props;

    const numImages = images.length;
    const uri1 = numImages > 0 ? images[0] : null;
    const uri2 = numImages > 1 ? images[1] : null;
    const uri3 = numImages > 2 ? images[2] : null;
    const uri4 = numImages > 3 ? images[3] : null;
    return (
      <View
        style={{
          width: width,
          height: width
        }}
      >
        <View style={{ top: 0, left: 0, position: "absolute" }}>
          <ProfilePciture
            uri={uri1}
            disabled={false}
            showDeleteButton={uri2 != null || enableDeleteFirst === true}
            onAdd={() => {
              this._onAdd(0, MAX_PHOTO_URI);
            }}
            onRemove={() => {
              this._onRemove(0);
            }}
            imageWidth={imageWidth}
          />
        </View>
        <View style={{ top: 0, right: 0, position: "absolute" }}>
          <ProfilePciture
            uri={uri2}
            disabled={uri1 == null}
            showDeleteButton={true}
            onAdd={() => {
              this._onAdd(1, MAX_PHOTO_URI);
            }}
            onRemove={() => {
              this._onRemove(1);
            }}
            imageWidth={imageWidth}
          />
        </View>
        <View style={{ bottom: 0, left: 0, position: "absolute" }}>
          <ProfilePciture
            uri={uri3}
            disabled={uri2 == null}
            showDeleteButton={true}
            onAdd={() => {
              this._onAdd(2, MAX_PHOTO_URI);
            }}
            onRemove={() => {
              this._onRemove(2);
            }}
            imageWidth={imageWidth}
          />
        </View>
        <View style={{ bottom: 0, right: 0, position: "absolute" }}>
          <ProfilePciture
            uri={uri4}
            disabled={uri3 == null}
            showDeleteButton={true}
            onAdd={() => {
              this._onAdd(3, MAX_PHOTO_URI);
            }}
            onRemove={() => {
              this._onRemove(3);
            }}
            imageWidth={imageWidth}
          />
        </View>
      </View>
    );
  }
}
