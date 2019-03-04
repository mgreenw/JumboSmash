// @flow

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Popup from 'mobile/components/shared/Popup';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import { SecondaryButton } from 'mobile/components/shared/buttons/SecondaryButton';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';

type ProppyProps = {
  visible: boolean,
  displayName: string,
  onCancel: () => void,
  onDone: () => void
};

type Props = ProppyProps;

type State = {
  step: 1 | 2,
  selectedReasons: boolean[]
};

const BLOCK_REASONS = [
  { text: 'Made me uncomfortable', code: 'UNCOMFORTABLE' },
  { text: 'Abusive or threatening', code: 'ABUSIVE' },
  { text: 'Inappropriate content', code: 'INAPPROPRIATE' },
  { text: 'Bad offline behavior', code: 'BEHAVIOR' },
  { text: 'No reason', code: 'NO_REASON' }
];

class BlockPopup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      step: 1,
      selectedReasons: []
    };
  }

  _renderBlockReasons() {
    const { selectedReasons } = this.state;
    const { displayName, onCancel } = this.props;

    return (
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
          {'Block'}
        </Text>
        <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
          {`Help keep JumboSmash safe by telling the team why you’re blocking ${displayName}.`}
        </Text>
        {BLOCK_REASONS.map((reason, i) => {
          const checked = selectedReasons[i];
          return (
            <View
              style={{ flexDirection: 'row', marginTop: 22 }}
              key={reason.code}
            >
              <TouchableOpacity
                style={{
                  width: 32,
                  height: 32,
                  borderColor: Colors.AquaMarine,
                  borderWidth: 2,
                  borderRadius: 32,
                  paddingTop: 1.5,
                  marginRight: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: checked ? Colors.AquaMarine : Colors.White
                }}
                onPress={() => {
                  const newSelectedReasons = selectedReasons;
                  newSelectedReasons[i] = !checked;
                  this.setState({ selectedReasons: newSelectedReasons });
                }}
              >
                <CustomIcon name="check" size={16} color={Colors.White} />
              </TouchableOpacity>
              <Text style={textStyles.headline6Style}>{reason.text}</Text>
            </View>
          );
        })}
        <View style={{ flexDirection: 'row', marginTop: 31 }}>
          <View style={{ flex: 1, paddingRight: 30 }}>
            <SecondaryButton
              onPress={onCancel}
              title="Cancel"
              loading={false}
              disabled={false}
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              onPress={() => {
                this.setState({ step: 2 });
              }}
              title={'Block'}
              loading={false}
              disabled={selectedReasons.filter(r => r).length === 0}
            />
          </View>
        </View>
      </View>
    );
  }

  _renderDone() {
    const { displayName, onDone } = this.props;
    return (
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
          {'Block'}
        </Text>
        <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
          {`Thanks for letting the team know. ${displayName} won’t be able to see you anymore in JumboSmash or JumboSocial.`}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 11
          }}
        >
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 20,
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 5
            }}
          >
            <CustomIcon name="check" size={10} color={Colors.White} />
          </View>
          <Text style={[textStyles.subtitle1Style]}>
            {`${displayName} has been blocked`}
          </Text>
        </View>
        <View style={{ marginTop: 31 }}>
          <PrimaryButton
            onPress={onDone}
            title={'Done'}
            loading={false}
            disabled={false}
          />
        </View>
      </View>
    );
  }

  render() {
    const { step } = this.state;
    const { visible, onCancel } = this.props;
    let renderedContent;
    if (step === 1) {
      renderedContent = this._renderBlockReasons();
    } else if (step === 2) {
      renderedContent = this._renderDone();
    } else {
      throw new Error('Error in Block Popup, invalid step number');
    }
    return (
      <Popup visible={visible} onTouchOutside={onCancel}>
        {renderedContent}
      </Popup>
    );
  }
}

export default BlockPopup;
