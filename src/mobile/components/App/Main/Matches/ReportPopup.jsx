// @flow

import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import Popup from 'mobile/components/shared/Popup';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import BioInput from 'mobile/components/shared/BioInput';
import Layout from 'mobile/components/shared/Popup_Layout';
import InProgress from 'mobile/components/shared/InProgress';
import ReportAction from 'mobile/actions/app/reportUser';
import ReasonSelector from './ReasonSelector';
import type { SelectedReason } from './ReasonSelector';

type ProppyProps = {
  visible: boolean,
  displayName: string,
  userId: number,
  onCancel: () => void,
  onDone: (block: boolean) => void
};

type ReduxProps = {
  report_inProgress: boolean
};

type DispatchProps = {
  reportUser: (
    userId: number,
    reportMessage: string,
    reasonCodes: string[]
  ) => void
};

type Props = ProppyProps & ReduxProps & DispatchProps;

type State = {
  step: 1 | 2 | 3,
  selectedReasons: SelectedReason[],
  reportMessage: string,
  block: boolean,
  fakeReportLoading: boolean
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  if (!reduxState.client) {
    throw new Error('client is null in report popup');
  }
  return {
    report_inProgress: reduxState.inProgress.reportUser
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    reportUser: (
      userId: number,
      reportMessage: string,
      reasonCodes: string[]
    ) => {
      dispatch(ReportAction(userId, reportMessage, reasonCodes));
    }
  };
}

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
      selectedReasons: REPORT_REASONS.map(reason => {
        return {
          reason,
          selected: false
        };
      }),
      reportMessage: '',
      block: false,
      fakeReportLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { report_inProgress } = this.props;
    if (report_inProgress && !nextProps.report_inProgress) {
      this.setState({ fakeReportLoading: true }, () => {
        // The timeout is so the progress bar doesn't look jumpy
        setTimeout(() => {
          this.setState({ step: 3, fakeReportLoading: false });
        }, 500);
      });
    }
  }

  _renderLoading() {
    return <InProgress message={'Reporting...'} />;
  }

  _onReport = () => {
    const { reportMessage, selectedReasons } = this.state;
    const { userId, reportUser } = this.props;
    const reasonCodes = selectedReasons.map(r => r.reason.code);
    reportUser(userId, reportMessage, reasonCodes);
  };

  _onToggleReason = (selected: boolean, index: number) => {
    const { selectedReasons } = this.state;
    const newSelectedReasons = [...selectedReasons];
    newSelectedReasons[index].selected = selected;
    this.setState({ selectedReasons: newSelectedReasons });
  };

  _renderReportReasons() {
    const { selectedReasons } = this.state;
    const { displayName, onCancel } = this.props;

    const reasonSelector = (
      <View style={{ marginBottom: 31 }}>
        <ReasonSelector
          reasons={selectedReasons}
          onToggle={this._onToggleReason}
        />
      </View>
    );

    return (
      <Layout
        title={'Report'}
        subtitle={`Help keep JumboSmash safe by telling the team why you’re reporting ${displayName}.`}
        body={reasonSelector}
        primaryButtonText={'Next'}
        primaryButtonDisabled={
          selectedReasons.filter(r => r.selected).length === 0
        }
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
          marginBottom: 77
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
        onPrimaryButtonPress={this._onReport}
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
        onSecondaryButtonPress={() => this.setState({ block: true })} // Will add block functinality in next pr
        flexRow={false}
      />
    );
  }

  render() {
    const { step, fakeReportLoading } = this.state;
    const { visible, report_inProgress } = this.props;
    let renderedContent;
    if (report_inProgress || fakeReportLoading) {
      renderedContent = this._renderLoading();
    } else if (step === 1) {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportPopup);
