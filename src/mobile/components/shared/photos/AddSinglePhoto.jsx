// @flow

import React from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'mobile/components/shared/imageCacheFork';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';
import ActionSheet from '../ActionSheet';

type Props = {
  onAdd: () => void,
  onRemove: () => void,
  enableRemove: boolean,
  width: number,
  photoUuid: ?string
};

type State = {
  showActionSheet: boolean
};

export default class AddSinglePhoto extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showActionSheet: false
    };
  }

  _toggleActionSheet = (showActionSheet: boolean) => {
    this.setState({ showActionSheet });
  };

  render() {
    const { onAdd, onRemove, width, photoUuid, enableRemove } = this.props;
    const { showActionSheet } = this.state;
    return (
      <View>
        <TouchableOpacity
          style={{
            width,
            height: width,
            backgroundColor: Colors.Ice,
            aspectRatio: 1,
            borderColor: Colors.AquaMarine,
            borderWidth: photoUuid ? 0 : 2,
            borderStyle: 'dashed',
            borderRadius: 3,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          disabled={false}
          onPress={
            photoUuid
              ? () => {
                  this._toggleActionSheet(true);
                }
              : onAdd
          }
        >
          {photoUuid ? (
            <Image
              style={{
                flex: 1,
                height: width,
                width,
                borderRadius: 8
              }}
              resizeMode="contain"
              uri={GET_PHOTO__ROUTE + photoUuid}
            />
          ) : (
            <Text
              style={[
                textStyles.headline6Style,
                { textDecorationLine: 'underline' }
              ]}
            >
              {photoUuid ? '' : 'Add'}
            </Text>
          )}
        </TouchableOpacity>
        <ActionSheet
          visible={showActionSheet}
          options={[
            {
              text: 'Reorder Photo',
              onPress: () => {
                this.setState({ showActionSheet: false }, () => {
                  Alert.alert('Reordering Not Implemented Yet. :(');
                });
              }
            },
            {
              text: 'Delete Photo',
              textStyle: {
                color: Colors.Grapefruit
              },
              onPress: () => {
                this.setState(
                  { showActionSheet: false },
                  enableRemove
                    ? onRemove
                    : () => {
                        Alert.alert(
                          "Plz don't delete your last photo everything will break :("
                        );
                      }
                );
              }
            }
          ]}
          cancel={{
            text: 'Cancel',
            onPress: () => {
              this._toggleActionSheet(false);
            }
          }}
        />
      </View>
    );
  }
}
