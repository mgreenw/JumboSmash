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
import YakReportAction from 'mobile/actions/yaks/reportYak';
import BlockAction from 'mobile/actions/app/blockUser';
import ReasonSelector from './ReasonSelector';
import type { SelectedReason } from './ReasonSelector';

type ProppyProps = {
  visible: boolean,
  displayName: string,
  userId: number,
  onCancel: () => void,
  onDone: (block: boolean) => void,

  // HACK HACK HACK YAK YAK YAK
  yak?: boolean
};

type ReduxProps = {
  report_inProgress: boolean,
  reportUserSuccess: ?boolean,
  block_inProgress: boolean,
  blockUserSuccess: ?boolean,
  reportYak_InProgress: boolean
};

type DispatchProps = {
  reportUser: (
    userId: number,
    reportMessage: string,
    reasonCodes: string[]
  ) => void,
  blockUser: (
    userId: number,
    reportMessage: string,
    reasonCodes: string[]
  ) => void,
  reportYak: (
    yakId: number,
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
  fakeReportLoading: boolean,
  fakeBlockLoading: boolean
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  if (!reduxState.client) {
    throw new Error('client is null in report popup');
  }
  return {
    reportYak_InProgress: reduxState.yaks.inProgress.report,
    report_inProgress: reduxState.inProgress.reportUser,
    reportUserSuccess: reduxState.response.reportUserSuccess,
    block_inProgress: reduxState.inProgress.blockUser,
    blockUserSuccess: reduxState.response.blockUserSuccess
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
    },
    blockUser: (
      userId: number,
      reportMessage: string,
      reasonCodes: string[]
    ) => {
      dispatch(BlockAction(userId, reportMessage, reasonCodes));
    },
    reportYak: (
      yakId: number,
      reportMessage: string,
      reasonCodes: string[]
    ) => {
      dispatch(YakReportAction(yakId, reportMessage, reasonCodes));
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

const YAK_REPORT_REASONS = [
  { text: 'Made me uncomfortable', code: 'UNCOMFORTABLE' },
  { text: 'Abusive or threatening', code: 'ABUSIVE' },
  { text: 'Inappropriate content', code: 'INAPPROPRIATE' },
  { text: 'Spam or scam', code: 'SPAM' }
];

class ReportPopup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const reasons = props.yak === true ? YAK_REPORT_REASONS : REPORT_REASONS;

    this.state = {
      step: 1,
      selectedReasons: reasons.map(reason => {
        return {
          reason,
          selected: false
        };
      }),
      reportMessage: '',
      block: false,
      fakeReportLoading: false,
      fakeBlockLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      report_inProgress,
      reportYak_InProgress,
      block_inProgress
    } = this.props;
    if (
      (report_inProgress && !nextProps.report_inProgress) ||
      (reportYak_InProgress && !nextProps.reportYak_InProgress)
    ) {
      this.setState({ fakeReportLoading: true }, () => {
        // The timeout is so the progress bar doesn't look jumpy
        setTimeout(() => {
          if (reportYak_InProgress) {
            this.setState({
              step: 3,
              fakeReportLoading: false
            });
          }
          if (nextProps.reportUserSuccess) {
            this.setState({ step: 3, fakeReportLoading: false });
          } else {
            this.setState({ fakeReportLoading: false });
          }
        }, 500);
      });
    } else if (block_inProgress && !nextProps.block_inProgress) {
      this.setState({ fakeBlockLoading: true }, () => {
        // The timeout is so the progress bar doesn't look jumpy
        setTimeout(() => {
          if (nextProps.blockUserSuccess) {
            this.setState({ block: true, fakeBlockLoading: false });
          } else {
            this.setState({ fakeBlockLoading: false });
          }
        }, 500);
      });
    }
  }

  _renderReportLoading() {
    return <InProgress message={'Reporting...'} />;
  }

  _renderBlockLoading() {
    return <InProgress message={'Blocking...'} />;
  }

  _onReport = () => {
    const { reportMessage, selectedReasons } = this.state;
    const { userId, reportUser, yak, reportYak } = this.props;
    const selectedReasonCodes = selectedReasons
      .filter(r => r.selected)
      .map(r => r.reason.code);
    if (yak === true) {
      reportYak(userId, reportMessage, selectedReasonCodes);
    } else {
      reportUser(userId, reportMessage, selectedReasonCodes);
    }
  };

  _onBlock = () => {
    const { reportMessage, selectedReasons } = this.state;
    const { userId, blockUser } = this.props;
    const selectedReasonCodes = selectedReasons
      .filter(r => r.selected)
      .map(r => r.reason.code);
    blockUser(userId, reportMessage, selectedReasonCodes);
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
    const { displayName, onDone, yak } = this.props;
    const { block, selectedReasons } = this.state;
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

    const baseSubtitle = 'Thanks for letting the team know.';
    const userReportSubtitle = `${baseSubtitle} If you’d also like to block ${displayName}, you can do so below.`;
    return (
      <Layout
        title={'Report'}
        subtitle={yak ? baseSubtitle : userReportSubtitle}
        body={body}
        primaryButtonText={'Done'}
        primaryButtonDisabled={false}
        primaryButtonLoading={false}
        onPrimaryButtonPress={() =>
          this.setState(
            {
              reportMessage: '',
              step: 1,
              selectedReasons: selectedReasons.map(r => ({
                ...r,
                selected: false
              }))
            },
            () => {
              onDone(block);
            }
          )
        }
        secondaryButtonText={
          !block && !yak ? `Block ${displayName}` : undefined
        }
        secondaryButtonDisabled={false}
        secondaryButtonLoading={false}
        onSecondaryButtonPress={this._onBlock}
        flexRow={false}
      />
    );
  }

  render() {
    const { step, fakeReportLoading, fakeBlockLoading } = this.state;
    const {
      visible,
      report_inProgress,
      block_inProgress,
      reportYak_InProgress
    } = this.props;
    let renderedContent;
    if (report_inProgress || fakeReportLoading || reportYak_InProgress) {
      renderedContent = this._renderReportLoading();
    } else if (block_inProgress || fakeBlockLoading) {
      renderedContent = this._renderBlockLoading();
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
