// @flow

import React from 'react';
import { View, Text } from 'react-native';
import Popup from 'mobile/components/shared/Popup';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import { SecondaryButton } from 'mobile/components/shared/buttons/SecondaryButton';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';

type ProppyProps = {
  visible: boolean,
  displayName: string,
  onCancel: () => void,
  onConfirm: () => void
};

type Props = ProppyProps;

class UnmatchPopup extends React.Component<Props> {
  render() {
    const { visible, onCancel, displayName, onConfirm } = this.props;

    return (
      <Popup visible={visible} onTouchOutside={onCancel}>
        <View>
          <Text
            style={[
              textStyles.headline4StyleMedium,
              {
                color: Colors.Grapefruit,
                textAlign: 'center'
              }
            ]}
          >
            {'Are you sure?'}
          </Text>
          <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
            {`This will unmatch you and ${displayName} in JumboSmash and JumboSocial.`}
          </Text>

          <View style={{ marginTop: 30, flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: 30 }}>
              <SecondaryButton
                onPress={onCancel}
                title="Cancel"
                loading={false}
                disabled={false}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                onPress={onConfirm}
                title="Unmatch"
                loading={false}
                disabled={false}
              />
            </View>
          </View>
        </View>
      </Popup>
    );
  }
}

export default UnmatchPopup;
