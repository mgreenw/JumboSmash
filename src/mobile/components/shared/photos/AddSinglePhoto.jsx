// @flow

import React from 'react';
import {
  Text, View, TouchableOpacity, Alert,
} from 'react-native';
import { Image } from 'mobile/components/shared/imageCacheFork';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';
import EditPopup from './EditPopup';

type Props = {
  onAdd: () => void,
  onRemove: () => void,
  enableRemove: boolean,
  width: number,
  photoId: ?number,
  token: ?string,
};

type State = {
  showEditPopup: boolean,
};

export default class AddSinglePhoto extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showEditPopup: false,
    };
  }

  _toggleEditPopup = (showEditPopup: boolean) => {
    this.setState({ showEditPopup });
  };

  render() {
    const {
      onAdd, onRemove, width, photoId, token, enableRemove,
    } = this.props;
    const { showEditPopup } = this.state;
    return (
      <View>
        <TouchableOpacity
          style={{
            width,
            height: width,
            backgroundColor: Colors.Ice,
            aspectRatio: 1,
            borderColor: Colors.AquaMarine,
            borderWidth: photoId ? 0 : 2,
            borderStyle: 'dashed',
            borderRadius: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={false}
          onPress={
            photoId
              ? () => {
                this._toggleEditPopup(true);
              }
              : onAdd
          }
        >
          {photoId ? (
            <Image
              style={{
                flex: 1,
                height: width,
                width,
                borderRadius: 8,
              }}
              resizeMode="contain"
              uri={GET_PHOTO__ROUTE + photoId}
              options={{
                headers: {
                  Authorization: token || '', // TODO: better token handling
                },
              }}
            />
          ) : (
            <Text style={[textStyles.headline6Style, { textDecorationLine: 'underline' }]}>
              {photoId ? '' : 'Add'}
            </Text>
          )}
        </TouchableOpacity>
        <EditPopup
          visible={showEditPopup}
          onDelete={() => {
            this.setState(
              { showEditPopup: false },
              enableRemove
                ? onRemove
                : () => {
                  Alert.alert("Plz don't delete your last photo everything will break :(");
                },
            );
          }}
          onReorder={() => {
            this.setState({ showEditPopup: false }, () => {
              Alert.alert('Reordering Not Implemented Yet. :(');
            });
          }}
          onCancel={() => {
            this._toggleEditPopup(false);
          }}
        />
      </View>
    );
  }
}
