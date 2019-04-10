// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import { Permissions, ImagePicker, ImageManipulator } from 'expo';
import Popup from 'mobile/components/shared/Popup';
import ProgressBar from 'react-native-progress/Bar';
import { connect } from 'react-redux';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import uploadPhotoAction from 'mobile/actions/app/uploadPhoto';
import deletePhotoAction from 'mobile/actions/app/deletePhoto';
import openAppSettings from 'mobile/utils/OpenAppSettings';
import AddSinglePhoto from './AddSinglePhoto';

type ReduxProps = {
  uploadPhotoInProgress: boolean,
  deletePhotoInProgress: boolean,
  photoUuids: string[],
  token: ?string
};

type DispatchProps = {
  uploadPhoto: string => void,
  deletePhoto: string => void
};

type ProppyProps = {
  imageWidth: number,
  width: number
};

type Props = ProppyProps & ReduxProps & DispatchProps;

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  if (!reduxState.client) {
    throw new Error('Err: client null in AddMultiPhotos mapStateToProps');
  }
  return {
    uploadPhotoInProgress: reduxState.inProgress.uploadPhoto,
    deletePhotoInProgress: reduxState.inProgress.deletePhoto,
    photoUuids: reduxState.client.profile.photoUuids,
    token: reduxState.token
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    uploadPhoto: (uri: string) => {
      dispatch(uploadPhotoAction(uri));
    },
    deletePhoto: (photoUuid: string) => {
      dispatch(deletePhotoAction(photoUuid));
    }
  };
}

// TODO: consider https://github.com/expo/expo/issues/1423 solution for croppinng
async function selectPhoto(): Promise<?string> {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === 'granted') {
    // Get uri of image
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (result.cancelled) {
      return null;
    }
    // TODO: use the height and width of the result to ensure square here, crop if not in manipulation step
    // ensure image is relatively small
    const { uri } = await ImageManipulator.manipulateAsync(result.uri, [], {
      compress: 1.0, // TODO: figure out how much this should be compressed. Currently, we don't
      format: 'jpeg',
      base64: false
    });

    return uri;
  }
  openAppSettings();
  return null;
}

class AddMultiPhotos extends React.Component<Props> {
  _onAdd = async () => {
    const newUri = await selectPhoto();
    const { uploadPhoto } = this.props;
    if (newUri) {
      uploadPhoto(newUri);
    }
  };

  _onRemove = (photoUuid: ?string) => {
    if (photoUuid === null || photoUuid === undefined) {
      return;
    }
    const { deletePhoto } = this.props;
    deletePhoto(photoUuid);
  };

  render() {
    const {
      photoUuids,
      imageWidth,
      width,
      token,
      deletePhotoInProgress,
      uploadPhotoInProgress
    } = this.props;
    const numImages = photoUuids.length;
    const uuid1 = numImages > 0 ? photoUuids[0] : null;
    const uuid2 = numImages > 1 ? photoUuids[1] : null;
    const uuid3 = numImages > 2 ? photoUuids[2] : null;
    const uuid4 = numImages > 3 ? photoUuids[3] : null;

    let popupMessage = '';

    if (uploadPhotoInProgress) {
      popupMessage = 'Uploading Photo';
    } else if (deletePhotoInProgress) {
      popupMessage = 'Deleting Photo';
    }

    return (
      <View
        style={{
          width,
          height: width
        }}
      >
        <View style={{ top: 0, left: 0, position: 'absolute' }}>
          <AddSinglePhoto
            token={token}
            photoUuid={uuid1}
            disabled={false}
            enableRemove={uuid2 != null}
            onAdd={() => {
              this._onAdd();
            }}
            onRemove={() => {
              this._onRemove(uuid1);
            }}
            onReorder={() => {}}
            enableReorder={uuid2 != null}
            isReordering={false}
            width={imageWidth}
          />
        </View>
        <View style={{ top: 0, right: 0, position: 'absolute' }}>
          <AddSinglePhoto
            token={token}
            photoUuid={uuid2}
            disabled={uuid1 == null}
            enableRemove
            onAdd={() => {
              this._onAdd();
            }}
            onRemove={() => {
              this._onRemove(uuid2);
            }}
            onReorder={() => {}}
            enableReorder
            isReordering
            width={imageWidth}
          />
        </View>
        <View style={{ bottom: 0, left: 0, position: 'absolute' }}>
          <AddSinglePhoto
            token={token}
            photoUuid={uuid3}
            disabled={uuid2 == null}
            enableRemove
            onAdd={() => {
              this._onAdd();
            }}
            onRemove={() => {
              this._onRemove(uuid3);
            }}
            onReorder={() => {}}
            enableReorder
            isReordering={false}
            width={imageWidth}
          />
        </View>
        <View style={{ bottom: 0, right: 0, position: 'absolute' }}>
          <AddSinglePhoto
            token={token}
            photoUuid={uuid4}
            disabled={uuid3 == null}
            enableRemove
            onAdd={() => {
              this._onAdd();
            }}
            onRemove={() => {
              this._onRemove(uuid4);
            }}
            onReorder={() => {}}
            enableReorder
            isReordering={false}
            width={imageWidth}
          />
        </View>
        <Popup
          onTouchOutside={() => {}}
          visible={uploadPhotoInProgress || deletePhotoInProgress}
        >
          <Text
            style={[
              textStyles.headline4Style,
              {
                color: Colors.Grapefruit,
                textAlign: 'center',
                paddingBottom: 20
              }
            ]}
          >
            {popupMessage}
          </Text>
          <ProgressBar
            progress={0.3}
            height={10}
            unfilledColor={Colors.IceBlue}
            borderWidth={0}
            color={Colors.Grapefruit}
            indeterminate
            borderRadius={6}
            width={null}
          />
        </Popup>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMultiPhotos);
