// @flow
/* eslint-disable */

import React from 'react';
import { Text, View, TouchableOpacity, Image, Dimensions, Alert, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { Permissions, ImagePicker } from 'expo';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import ProgressBar from 'react-native-progress/Bar';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { ReduxState } from 'mobile/reducers/index';
import { uploadPhoto } from 'mobile/actions/app/uploadPhoto';
import { deletePhoto } from 'mobile/actions/app/deletePhoto';
import { AddSinglePhoto } from './AddSinglePhoto';

type reduxProps = {
  uploadPhotoInProgress: boolean,
  deletePhotoInProgress: boolean,
  photoIds: number[],
  token: ?string,
};

type dispatchProps = {
  uploadPhoto: string => void,
  deletePhoto: number => void,
};

type proppyProps = {
  enableDeleteFirst?: boolean,
  imageWidth: number,
  width: number,
};

type Props = proppyProps & reduxProps & dispatchProps;

function mapStateToProps(reduxState: ReduxState, ownProps: Props): reduxProps {
  if (!reduxState.client) {
    throw 'Err: client null in AddMultiPhotos mapStateToProps';
  }
  return {
    uploadPhotoInProgress: reduxState.inProgress.uploadPhoto,
    deletePhotoInProgress: reduxState.inProgress.deletePhoto,
    photoIds: reduxState.client.profile.photoIds,
    token: reduxState.token,
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props): dispatchProps {
  return {
    uploadPhoto: (uri: string) => {
      dispatch(uploadPhoto(uri));
    },
    deletePhoto: (photoId: number) => {
      dispatch(deletePhoto(photoId));
    },
  };
}

// TODO: consider https://github.com/expo/expo/issues/1423 solution for croppinng
async function selectPhoto(): Promise<?string> {
  const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === 'granted') {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
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
    if (newUri) {
      this.props.uploadPhoto(newUri);
    }
  };

  _onRemove = (photoId: number) => {
    this.props.deletePhoto(photoId);
  };

  render() {
    const {
      photoIds,
      enableDeleteFirst,
      imageWidth,
      width,
      token,
      deletePhotoInProgress,
      uploadPhotoInProgress,
    } = this.props;
    const numImages = photoIds.length;
    const id1 = numImages > 0 ? photoIds[0] : null;
    const id2 = numImages > 1 ? photoIds[1] : null;
    const id3 = numImages > 2 ? photoIds[2] : null;
    const id4 = numImages > 3 ? photoIds[3] : null;

    return (
      <View
        style={{
          width,
          height: width,
        }}
      >
        <View style={{ top: 0, left: 0, position: 'absolute' }}>
          <AddSinglePhoto
            token={token}
            photoId={id1}
            disabled={false}
            enableRemove={id2 != null || enableDeleteFirst === true}
            onAdd={() => {
              this._onAdd();
            }}
            onRemove={() => {
              if (id1) {
                this._onRemove(id1);
              }
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
              if (id2) {
                this._onRemove(id2);
              }
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
              if (id3) {
                this._onRemove(id3);
              }
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
              if (id4) {
                this._onRemove(id4);
              }
            }}
            width={imageWidth}
          />
        </View>
        <Dialog
          dialogAnimation={new ScaleAnimation()}
          width={1}
          visible={uploadPhotoInProgress || deletePhotoInProgress}
          actionsBordered
          dialogStyle={{
            /* This is a hack so that we can do a shadow over a wrapper */
            backgroundColor: 'transparent',
            padding: 18,
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
                width: 0,
              },
              padding: 20,
            }}
          >
            <View>
              <Text
                style={[
                  textStyles.headline4StyleMedium,
                  {
                    color: Colors.Grapefruit,
                    textAlign: 'center',
                    paddingBottom: 20,
                  },
                ]}
              >
                {uploadPhotoInProgress ? 'Uploading Photo' : 'Deleting Photo'}
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
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddMultiPhotos);
