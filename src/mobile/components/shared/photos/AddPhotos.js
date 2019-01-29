// @flow
import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  StyleSheet
} from "react-native";
import { Icon } from "react-native-elements";
import { Colors } from "mobile/styles/colors";
import { textStyles } from "mobile/styles/textStyles";
import CustomIcon from "mobile/assets/icons/CustomIcon";
import { Permissions, ImagePicker } from "expo";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation
} from "react-native-popup-dialog";
import ProgressBar from "react-native-progress/Bar";
import { connect } from "react-redux";
import type { Dispatch } from "redux";
import type { ReduxState } from "mobile/reducers/index";
import { uploadPhoto } from "mobile/actions/app/uploadPhoto";

import { GET_PHOTO } from "mobile/api/routes";

type ProfilePictureProps = {
  disabled: boolean,
  showDeleteButton: boolean,
  photoId: ?number,
  onAdd?: () => void,
  onRemove?: () => void,
  imageWidth: number,
  token: ?string
};
class ProfilePicture extends React.Component<ProfilePictureProps> {
  render() {
    const {
      photoId,
      disabled,
      onAdd,
      showDeleteButton,
      onRemove,
      imageWidth,
      token
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
            borderWidth: photoId ? 0 : 2,
            borderStyle: "dashed",
            borderRadius: 3,
            alignItems: "center",
            justifyContent: "center"
          }}
          disabled={photoId || disabled}
          onPress={photoId ? null : onAdd}
        >
          {photoId ? (
            <Image
              style={{
                flex: 1,
                height: imageWidth,
                width: imageWidth,
                borderRadius: 8
              }}
              resizeMode="contain"
              loadingStyle={{ size: "large", color: "blue" }}
              source={{
                uri: photoId ? GET_PHOTO + photoId : "",
                headers: {
                  Authorization: token || ""
                }
              }}
            />
          ) : (
            <Text style={textStyles.headline6Style}>
              {disabled ? "" : "add"}
            </Text>
          )}
        </TouchableOpacity>
        {showDeleteButton && photoId ? (
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

type reduxProps = {
  uploadPhotoInProgress: boolean,
  token: ?string
};

type dispatchProps = {
  uploadPhoto: string => void
};

type AddPhotosProps = {
  photoIds: $ReadOnlyArray<?number>,
  enableDeleteFirst?: boolean,
  onChangeImages: ($ReadOnlyArray<?number>) => void,
  imageWidth: number,
  width: number
} & reduxProps &
  dispatchProps;

function mapStateToProps(
  reduxState: ReduxState,
  ownProps: AddPhotosProps
): reduxProps {
  return {
    uploadPhotoInProgress: reduxState.inProgress.uploadPhoto,
    token: reduxState.token
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: AddPhotosProps
): dispatchProps {
  return {
    uploadPhoto: (uri: string) => {
      dispatch(uploadPhoto(uri));
    }
  };
}

async function selectPhoto(): Promise<?string> {
  const { status, permissions } = await Permissions.askAsync(
    Permissions.CAMERA_ROLL
  );
  if (status === "granted") {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1]
    });
    return result.uri;
  } else {
    Alert.alert("Please enable camera roll access to proceed.");
    return null;
  }
}

class AddPhotos extends React.Component<AddPhotosProps> {
  // _onAdd = async (index: number) => {
  //   const newUri = await selectPhoto();
  //   if (newUri) {
  //     const newImages = this.props.photoIds.slice();
  //     newImages[index] = newUri;
  //     this.props.uploadPhoto(newUri);
  //     this.props.onChangeImages(newImages);
  //   }
  // };
  //
  // _onRemove = (index: number) => {
  //   const newImages = this.props.photoIds.slice();
  //   newImages.splice(index, 1);
  //   newImages[3] = null;
  //   this.props.onChangeImages(newImages);
  // };

  render() {
    const {
      photoIds,
      enableDeleteFirst,
      imageWidth,
      width,
      token
    } = this.props;
    console.log(photoIds);
    const numImages = photoIds.length;
    const id1 = numImages > 0 ? photoIds[0] : null;
    const id2 = numImages > 1 ? photoIds[1] : null;
    const id3 = numImages > 2 ? photoIds[2] : null;
    const id4 = numImages > 3 ? photoIds[3] : null;

    return (
      <View
        style={{
          width: width,
          height: width
        }}
      >
        <View style={{ top: 0, left: 0, position: "absolute" }}>
          <ProfilePicture
            token={token}
            photoId={id1}
            disabled={false}
            showDeleteButton={id2 != null || enableDeleteFirst === true}
            onAdd={() => {
              // this._onAdd(0);
            }}
            onRemove={() => {
              // this._onRemove(0);
            }}
            imageWidth={imageWidth}
          />
        </View>
        <View style={{ top: 0, right: 0, position: "absolute" }}>
          <ProfilePicture
            token={token}
            photoId={id2}
            disabled={id1 == null}
            showDeleteButton={true}
            onAdd={() => {
              // this._onAdd(1);
            }}
            onRemove={() => {
              // this._onRemove(1);
            }}
            imageWidth={imageWidth}
          />
        </View>
        <View style={{ bottom: 0, left: 0, position: "absolute" }}>
          <ProfilePicture
            token={token}
            photoId={id3}
            disabled={id2 == null}
            showDeleteButton={true}
            onAdd={() => {
              // this._onAdd(2);
            }}
            onRemove={() => {
              // this._onRemove(2);
            }}
            imageWidth={imageWidth}
          />
        </View>
        <View style={{ bottom: 0, right: 0, position: "absolute" }}>
          <ProfilePicture
            token={token}
            photoId={id4}
            disabled={id3 == null}
            showDeleteButton={true}
            onAdd={() => {
              // this._onAdd(3);
            }}
            onRemove={() => {
              // this._onRemove(3);
            }}
            imageWidth={imageWidth}
          />
        </View>
        <Dialog
          dialogAnimation={new ScaleAnimation()}
          width={1}
          visible={this.props.uploadPhotoInProgress}
          actionsBordered
          dialogStyle={{
            /* This is a hack so that we can do a shadow over a wrapper */
            backgroundColor: "transparent",
            padding: 18
          }}
        >
          <DialogContent
            style={{
              backgroundColor: Colors.White,
              borderRadius: 8,
              shadowColor: Colors.Black,
              shadowOpacity: 1,
              shadowRadius: 4,
              shadowOffset: {
                height: 2,
                width: 0
              },
              padding: 20
            }}
          >
            <View>
              <Text
                style={[
                  textStyles.headline4StyleMedium,
                  {
                    color: Colors.Grapefruit,
                    textAlign: "center",
                    paddingBottom: 20
                  }
                ]}
              >
                {"Uploading Photo"}
              </Text>
              <ProgressBar
                progress={0.3}
                height={10}
                unfilledColor={Colors.IceBlue}
                borderWidth={0}
                color={Colors.Grapefruit}
                indeterminate={true}
                borderRadius={6}
                width={null}
              />
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPhotos);
