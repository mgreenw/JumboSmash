// @flow

import React from 'react';
import { View, Text } from 'react-native';
import Popup from 'mobile/components/shared/Popup';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import BioInput from 'mobile/components/shared/BioInput';
import Layout from 'mobile/components/shared/Popup_Layout';
import ReasonSelector from './ReasonSelector';
import type { Reason } from './ReasonSelector';

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

  _onSelectReason = (reason: Reason, index: number) => {
    const { selectedReasons } = this.state;
    const checked = selectedReasons[index];
    const newSelectedReasons = selectedReasons;
    newSelectedReasons[index] = !checked;
    this.setState({ selectedReasons: newSelectedReasons });
  };

  _renderReportReasons() {
    const { selectedReasons } = this.state;
    const { displayName, onCancel } = this.props;

    const reasonSelector = (
      <View style={{ marginBottom: 31 }}>
        <ReasonSelector
          reasons={REPORT_REASONS}
          selectedReasons={selectedReasons}
          onSelect={this._onSelectReason}
        />
      </View>
    );

    return (
      <Layout
        title={'Report'}
        subtitle={`Help keep JumboSmash safe by telling the team why you’re reporting ${displayName}.`}
        body={reasonSelector}
        primaryButtonText={'Next'}
        primaryButtonDisabled={selectedReasons.filter(r => r).length === 0}
        primaryButtonLoading={false}
        onPrimaryButtonPress={() => this.setState({ step: 2 })}
        secondaryButtonText={'Cancel'}
        secondaryButtonDisabled={false}
        secondaryButtonLoading={false}
        onSecondaryButtonPress={onCancel}
      />
    );
  }

  _renderReportInput() {
    const { displayName } = this.props;
    const { reportMessage } = this.state;
    const body = (
      <View
        style={{
          maxHeight: 160,
          marginTop: 20,
          marginBottom: 77,
          borderWidth: 1.5,
          borderRadius: 3,
          borderColor: Colors.Black
        }}
      >
        <BioInput
          value={reportMessage}
          onChangeText={text => this.setState({ reportMessage: text })}
          placeholder={'Any other information about what happened'}
        />
      </View>
    );
    return (
      <Layout
        title={'Report'}
        subtitle={`Help keep JumboSmash safe by telling the team why you’re reporting ${displayName}.`}
        body={body}
        primaryButtonText={'Report'}
        primaryButtonDisabled={false}
        primaryButtonLoading={false}
        onPrimaryButtonPress={() => this.setState({ step: 3 })}
        secondaryButtonText={'Back'}
        secondaryButtonDisabled={false}
        secondaryButtonLoading={false}
        onSecondaryButtonPress={() => this.setState({ step: 1 })}
      />
    );
  }

  _renderReportConfirm() {
    const { displayName, onDone } = this.props;
    const { block } = this.state;
    const body = (
      <View style={{ marginTop: 20 }}>
        {block && (
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
        )}
      </View>
    );

    return (
      <Layout
        title={'Report'}
        subtitle={`Thanks for letting the team know. If you’d also like to block ${displayName}, you can do so below.`}
        body={body}
        primaryButtonText={'Done'}
        primaryButtonDisabled={false}
        primaryButtonLoading={false}
        onPrimaryButtonPress={() => onDone(block)}
        secondaryButtonText={!block ? `Block ${displayName}` : undefined}
        secondaryButtonDisabled={false}
        secondaryButtonLoading={false}
        onSecondaryButtonPress={() => this.setState({ block: true })}
        flexRow={false}
      />
    );
  }

  render() {
    const { step } = this.state;
    const { visible } = this.props;
    let renderedContent;
    if (step === 1) {
      renderedContent = this._renderReportReasons();
    } else if (step === 2) {
      renderedContent = this._renderReportInput();
    } else if (step === 3) {
      renderedContent = this._renderReportConfirm();
    }
    return (
      <Popup visible={visible} onTouchOutside={() => {}}>
        {renderedContent}
      </Popup>
    );
  }
}

export default ReportPopup;
