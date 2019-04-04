// @flow

import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import Popup from 'mobile/components/shared/Popup';
import BioInput from 'mobile/components/shared/BioInput';
import Layout from 'mobile/components/shared/Popup_Layout';
import InProgress from 'mobile/components/shared/InProgress';
import SendFeedbackAction from 'mobile/actions/app/meta/sendFeedback';

type ProppyProps = {
  visible: boolean,
  onCancel: () => void,
  onDone: () => void
};

type ReduxProps = {
  sendFeedback_inProgress: boolean,
  sendFeedbackSuccess: ?boolean
};

type DispatchProps = {
  sendFeedback: (message: string) => void
};

type Props = ProppyProps & ReduxProps & DispatchProps;

type State = {
  message: string,
  fakeSendFeedbackLoading: boolean
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  if (!reduxState.client) {
    throw new Error('client is null in send feedback popup');
  }
  return {
    sendFeedback_inProgress: reduxState.inProgress.sendFeedback,
    sendFeedbackSuccess: reduxState.response.sendFeedbackSuccess
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    sendFeedback: (message: string) => {
      dispatch(SendFeedbackAction(message));
    }
  };
}

class FeedbackPopup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      message: '',
      fakeSendFeedbackLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { sendFeedback_inProgress, onDone } = this.props;
    if (sendFeedback_inProgress && !nextProps.sendFeedback_inProgress) {
      this.setState({ fakeSendFeedbackLoading: true }, () => {
        // The timeout is so the progress bar doesn't look jumpy
        setTimeout(() => {
          if (nextProps.sendFeedbackSuccess) {
            onDone();
            this.setState({ fakeSendFeedbackLoading: false });
          } else {
            this.setState({ fakeSendFeedbackLoading: false });
          }
        }, 500);
      });
    }
  }

  _renderSendFeedbackLoading() {
    return <InProgress message={'Sending Feedback...'} />;
  }

  _onSendFeedback = () => {
    const { message } = this.state;
    const { sendFeedback } = this.props;
    sendFeedback(message);
  };

  _renderFeedbackInput() {
    const { message } = this.state;
    const body = (
      <View
        style={{
          maxHeight: 160,
          marginTop: 20,
          marginBottom: 77
        }}
      >
        <BioInput
          value={message}
          onChangeText={text => this.setState({ message: text })}
          placeholder={'Feedback here'}
        />
      </View>
    );
    return (
      <Layout
        title={'Help & Feedback'}
        subtitle={`Found a bug? Wish the app was different? Want a specific feature? Make JumboSmash the best it can be by letting the team know.`}
        body={body}
        primaryButtonText={'Submit Feedback'}
        primaryButtonDisabled={false}
        primaryButtonLoading={false}
        onPrimaryButtonPress={this._onSendFeedback}
      />
    );
  }

  render() {
    const { fakeSendFeedbackLoading } = this.state;
    const { visible, sendFeedback_inProgress, onCancel } = this.props;
    let renderedContent;
    if (sendFeedback_inProgress || fakeSendFeedbackLoading) {
      renderedContent = this._renderSendFeedbackLoading();
    } else {
      renderedContent = this._renderFeedbackInput();
    }
    return (
      <Popup visible={visible} onTouchOutside={() => onCancel()}>
        {renderedContent}
      </Popup>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedbackPopup);
