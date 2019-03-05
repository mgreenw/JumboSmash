// @flow

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
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
  onDone: (block: boolean) => void
};

type Props = ProppyProps;

type State = {
  step: 1 | 2 | 3,
  selectedReasons: boolean[],
  reportMessage: string,
  block: boolean
};

const REPORT_REASONS = [
  { text: 'Made me uncomfortable', code: 'UNCOMFORTABLE' },
  { text: 'Abusive or threatening', code: 'ABUSIVE' },
  { text: 'Inappropriate content', code: 'INAPPROPRIATE' },
  { text: 'Bad offline behavior', code: 'BEHAVIOR' },
  { text: 'Spam or scam', code: 'SPAM' }
];

class ReportPopup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      step: 1,
      selectedReasons: [],
      reportMessage: '',
      block: false
    };
  }

  _renderReportReasons() {
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
          {'Report'}
        </Text>
        <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
          {`Help keep JumboSmash safe by telling the team why you’re reporting ${displayName}.`}
        </Text>
        {REPORT_REASONS.map((reason, i) => {
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
              title={'Next'}
              loading={false}
              disabled={selectedReasons.filter(r => r).length === 0}
            />
          </View>
        </View>
      </View>
    );
  }

  _renderReportInput() {
    const { displayName } = this.props;
    const { reportMessage } = this.state;
    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
              {'Report'}
            </Text>
            <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
              {`Please share any additional details about why you're reporting ${displayName}.`}
            </Text>
            <View
              style={{
                maxHeight: 160,
                marginTop: 20,
                borderWidth: 1.5,
                borderRadius: 3,
                borderColor: Colors.Black
              }}
            >
              <TextInput
                style={[
                  textStyles.headline6Style,
                  {
                    height: '100%',
                    padding: 9,
                    textAlignVertical: 'top'
                  }
                ]}
                placeholderTextColor={Colors.Grey80}
                placeholder="Any other information about what happened"
                onChangeText={text => this.setState({ reportMessage: text })}
                autoCorrect
                multiline
                value={reportMessage}
                underlineColorAndroid={'transparent'}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 77 }}>
              <View style={{ flex: 1, paddingRight: 30 }}>
                <SecondaryButton
                  onPress={() => this.setState({ step: 1 })}
                  title="Back"
                  loading={false}
                  disabled={false}
                />
              </View>
              <View style={{ flex: 1 }}>
                <PrimaryButton
                  onPress={() => {
                    this.setState({ step: 3 });
                  }}
                  title={'Report'}
                  loading={false}
                  disabled={false}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  _renderReportConfirm() {
    const { displayName, onDone } = this.props;
    const { block } = this.state;
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
          {'Report'}
        </Text>
        <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
          {`Thanks for letting the team know. If you’d also like to block ${displayName}, you can do so below.`}
        </Text>

        <View style={{ marginTop: 20, marginBottom: 20 }}>
          {block ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center'
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
          ) : (
            <SecondaryButton
              onPress={() => this.setState({ block: true })}
              title={`Block ${displayName}`}
              loading={false}
              disabled={false}
            />
          )}
        </View>
        <View>
          <PrimaryButton
            onPress={() => {
              this.setState({
                step: 1,
                reportMessage: '',
                selectedReasons: [],
                block: false
              });
              onDone(block);
            }}
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
      renderedContent = this._renderReportReasons();
    } else if (step === 2) {
      renderedContent = this._renderReportInput();
    } else if (step === 3) {
      renderedContent = this._renderReportConfirm();
    }
    return (
      <Popup
        visible={visible}
        onTouchOutside={() => {
          onCancel();
          this.setState({
            step: 1,
            reportMessage: '',
            selectedReasons: [],
            block: false
          });
        }}
      >
        {renderedContent}
      </Popup>
    );
  }
}

export default ReportPopup;
