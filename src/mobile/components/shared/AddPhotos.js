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

type ProfilePictureProps = {
  disabled: boolean,
  showDeleteButton: boolean,
  uri: ?string,
  onAdd?: () => void,
  onRemove?: () => void,
  imageWidth: number
};
class ProfilePicture extends React.Component<ProfilePictureProps> {
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

type reduxProps = {
  uploadPhotoInProgress: boolean
};

type dispatchProps = {
  uploadPhoto: string => void
};

type AddPhotosProps = {
  images: $ReadOnlyArray<?string>,
  enableDeleteFirst?: boolean,
  onChangeImages: ($ReadOnlyArray<?string>) => void,
  imageWidth: number,
  width: number
} & reduxProps &
  dispatchProps;

type AddPhotosState = {
  isUploadingPhoto: boolean
};

function mapStateToProps(
  reduxState: ReduxState,
  ownProps: AddPhotosProps
): reduxProps {
  return {
    uploadPhotoInProgress: reduxState.inProgress.uploadPhotoInProgress
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

class AddPhotos extends React.Component<AddPhotosProps, AddPhotosState> {
  constructor(props: AddPhotosProps) {
    super(props);
    this.state = {
      isUploadingPhoto: false,
      defaultAnimationDialog: false
    };
  }

  _onAdd = async (index: number) => {
    const newUri = await selectPhoto();
    this.setState({
      isUploadingPhoto: true
    });
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
          <ProfilePicture
            uri={uri1}
            disabled={false}
            showDeleteButton={uri2 != null || enableDeleteFirst === true}
            onAdd={() => {
              this._onAdd(0);
            }}
            onRemove={() => {
              this._onRemove(0);
            }}
            imageWidth={imageWidth}
          />
        </View>
        <View style={{ top: 0, right: 0, position: "absolute" }}>
          <ProfilePicture
            uri={uri2}
            disabled={uri1 == null}
            showDeleteButton={true}
            onAdd={() => {
              this._onAdd(1);
            }}
            onRemove={() => {
              this._onRemove(1);
            }}
            imageWidth={imageWidth}
          />
        </View>
        <View style={{ bottom: 0, left: 0, position: "absolute" }}>
          <ProfilePicture
            uri={uri3}
            disabled={uri2 == null}
            showDeleteButton={true}
            onAdd={() => {
              this._onAdd(2);
            }}
            onRemove={() => {
              this._onRemove(2);
            }}
            imageWidth={imageWidth}
          />
        </View>
        <View style={{ bottom: 0, right: 0, position: "absolute" }}>
          <ProfilePicture
            uri={uri4}
            disabled={uri3 == null}
            showDeleteButton={true}
            onAdd={() => {
              this._onAdd(3);
            }}
            onRemove={() => {
              this._onRemove(3);
            }}
            imageWidth={imageWidth}
          />
        </View>
        <Dialog
          onTouchOutside={() => {
            this.setState({ isUploadingPhoto: false });
          }}
          dialogAnimation={new ScaleAnimation()}
          width={1}
          visible={this.state.isUploadingPhoto}
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
