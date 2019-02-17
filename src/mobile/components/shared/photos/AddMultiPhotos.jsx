// @flow

import React from 'react';
import { Text, View, Alert } from 'react-native';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import { Permissions, ImagePicker } from 'expo';
import Popup from 'mobile/components/shared/Popup';
import ProgressBar from 'react-native-progress/Bar';
import { connect } from 'react-redux';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import uploadPhotoAction from 'mobile/actions/app/uploadPhoto';
import deletePhotoAction from 'mobile/actions/app/deletePhoto';
import AddSinglePhoto from './AddSinglePhoto';

type ReduxProps = {
  uploadPhotoInProgress: boolean,
  deletePhotoInProgress: boolean,
  photoIds: number[],
  token: ?string
};

type DispatchProps = {
  uploadPhoto: string => void,
  deletePhoto: number => void
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
    photoIds: reduxState.client.profile.photoIds,
    token: reduxState.token
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    uploadPhoto: (uri: string) => {
      dispatch(uploadPhotoAction(uri));
    },
    deletePhoto: (photoId: number) => {
      dispatch(deletePhotoAction(photoId));
    }
  };
}

// TODO: consider https://github.com/expo/expo/issues/1423 solution for croppinng
async function selectPhoto(): Promise<?string> {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === 'granted') {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (result.cancelled) {
      return null;
    }
    return result.uri;
  }
  Alert.alert('Please enable camera roll access to proceed.');
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

  _onRemove = (photoId: ?number) => {
    if (photoId === null || photoId === undefined) {
      return;
    }
    const { deletePhoto } = this.props;
    deletePhoto(photoId);
  };

  render() {
    const {
      photoIds,
      imageWidth,
      width,
      token,
      deletePhotoInProgress,
      uploadPhotoInProgress
    } = this.props;
    const numImages = photoIds.length;
    const id1 = numImages > 0 ? photoIds[0] : null;
    const id2 = numImages > 1 ? photoIds[1] : null;
    const id3 = numImages > 2 ? photoIds[2] : null;
    const id4 = numImages > 3 ? photoIds[3] : null;

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
            photoId={id1}
            disabled={false}
            enableRemove={id2 != null}
            onAdd={() => {
              this._onAdd();
            }}
            onRemove={() => {
              this._onRemove(id1);
            }}
            width={imageWidth}
          />
        </View>
        <View style={{ top: 0, right: 0, position: 'absolute' }}>
          <AddSinglePhoto
            token={token}
            photoId={id2}
            disabled={id1 == null}
            enableRemove
            onAdd={() => {
              this._onAdd();
            }}
            onRemove={() => {
              this._onRemove(id2);
            }}
            width={imageWidth}
          />
        </View>
        <View style={{ bottom: 0, left: 0, position: 'absolute' }}>
          <AddSinglePhoto
            token={token}
            photoId={id3}
            disabled={id2 == null}
            enableRemove
            onAdd={() => {
              this._onAdd();
            }}
            onRemove={() => {
              this._onRemove(id3);
            }}
            width={imageWidth}
          />
        </View>
        <View style={{ bottom: 0, right: 0, position: 'absolute' }}>
          <AddSinglePhoto
            token={token}
            photoId={id4}
            disabled={id3 == null}
            enableRemove
            onAdd={() => {
              this._onAdd();
            }}
            onRemove={() => {
              this._onRemove(id4);
            }}
            width={imageWidth}
          />
        </View>
        <Popup
          onTouchOutside={() => {}}
          visible={uploadPhotoInProgress || deletePhotoInProgress}
        >
          <Text
            style={[
              textStyles.headline4StyleMedium,
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
