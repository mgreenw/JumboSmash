// @flow

import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'mobile/components/shared/imageCacheFork';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';
import ActionSheet from '../ActionSheet';

type Props = {
  onAdd: () => void,
  onRemove: () => void,
  onReorder: () => void,
  enableReorder: boolean,
  isReordering: boolean,
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
    const {
      onAdd,
      onRemove,
      width,
      photoUuid,
      enableRemove,
      enableReorder,
      onReorder,
      isReordering
    } = this.props;
    const { showActionSheet } = this.state;
    const reorderOptions = enableReorder
      ? [
          {
            text: 'Reorder Photo',
            onPress: () => {
              this.setState({ showActionSheet: false }, onReorder);
            }
          }
        ]
      : [];
    const removeOptions = enableRemove
      ? [
          {
            text: 'Delete Photo',
            textStyle: {
              color: Colors.Grapefruit
            },
            onPress: () => {
              this.setState({ showActionSheet: false }, onRemove);
            }
          }
        ]
      : [];
    const actionSheetOptions = [...reorderOptions, ...removeOptions];
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
            <View
              style={{
                flex: 1,
                height: width,
                width,
                borderRadius: 8
              }}
            >
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
              {isReordering && (
                <View
                  style={{
                    position: 'absolute',
                    height: width,
                    width,
                    backgroundColor: Colors.Black,
                    opacity: 0.7,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={[
                      textStyles.headline6Style,
                      { color: '#FFFFFF', textDecorationLine: 'underline' }
                    ]}
                  >
                    {'Swap'}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text
              style={[
                textStyles.headline6Style,
                { textDecorationLine: 'underline' }
              ]}
            >
              {'Add'}
            </Text>
          )}
        </TouchableOpacity>
        <ActionSheet
          visible={showActionSheet}
          options={actionSheetOptions}
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
