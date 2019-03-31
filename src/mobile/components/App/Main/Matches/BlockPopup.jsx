// @flow

import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import Popup from 'mobile/components/shared/Popup';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import Layout from 'mobile/components/shared/Popup_Layout';
import InProgress from 'mobile/components/shared/InProgress';
import BlockAction from 'mobile/actions/app/blockUser';
import ReasonSelector from './ReasonSelector';
import type { SelectedReason } from './ReasonSelector';

type ProppyProps = {
  visible: boolean,
  displayName: string,
  userId: number,
  onCancel: () => void,
  onDone: () => void
};

type ReduxProps = {
  block_inProgress: boolean,
  blockUserSuccess: ?boolean
};

type DispatchProps = {
  blockUser: (
    userId: number,
    reportMessage: string,
    reasonCodes: string[]
  ) => void
};

type Props = ProppyProps & ReduxProps & DispatchProps;

type State = {
  step: 1 | 2,
  reportMessage: string,
  selectedReasons: SelectedReason[],
  fakeBlockLoading: boolean
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  if (!reduxState.client) {
    throw new Error('client is null in block popup');
  }
  return {
    block_inProgress: reduxState.inProgress.blockUser,
    blockUserSuccess: reduxState.response.blockUserSuccess
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    blockUser: (
      userId: number,
      reportMessage: string,
      reasonCodes: string[]
    ) => {
      dispatch(BlockAction(userId, reportMessage, reasonCodes));
    }
  };
}

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
      selectedReasons: BLOCK_REASONS.map(reason => {
        return {
          reason,
          selected: false
        };
      }),
      reportMessage: '',
      fakeBlockLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { block_inProgress } = this.props;
    if (block_inProgress && !nextProps.block_inProgress) {
      this.setState({ fakeBlockLoading: true }, () => {
        // The timeout is so the progress bar doesn't look jumpy
        setTimeout(() => {
          if (nextProps.blockUserSuccess) {
            this.setState({ step: 2, fakeBlockLoading: false });
          } else {
            this.setState({ fakeBlockLoading: false });
          }
        }, 500);
      });
    }
  }

  _renderLoading() {
    return <InProgress message={'Block...'} />;
  }

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

  _renderBlockReasons() {
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
        title={'Block'}
        subtitle={`Help keep JumboSmash safe by telling the team why you’re blocking ${displayName}.`}
        body={reasonSelector}
        primaryButtonText={'Block'}
        primaryButtonDisabled={
          selectedReasons.filter(r => r.selected).length === 0
        }
        primaryButtonLoading={false}
        onPrimaryButtonPress={this._onBlock}
        secondaryButtonText={'Cancel'}
        secondaryButtonDisabled={false}
        secondaryButtonLoading={false}
        onSecondaryButtonPress={onCancel}
      />
    );
  }

  _renderDone() {
    const { displayName, onDone } = this.props;
    const body = (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 20
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
    );

    return (
      <Layout
        title={'Block'}
        subtitle={`Thanks for letting the team know. ${displayName} won’t be able to see you anymore in JumboSmash or JumboSocial.`}
        body={body}
        primaryButtonText={'Done'}
        primaryButtonDisabled={false}
        primaryButtonLoading={false}
        onPrimaryButtonPress={onDone}
        flexRow={false}
      />
    );
  }

  render() {
    const { step, fakeBlockLoading } = this.state;
    const { visible, block_inProgress } = this.props;
    let renderedContent;
    if (block_inProgress || fakeBlockLoading) {
      renderedContent = this._renderLoading();
    } else if (step === 1) {
      renderedContent = this._renderBlockReasons();
    } else if (step === 2) {
      renderedContent = this._renderDone();
    } else {
      throw new Error('Error in Block Popup, invalid step number');
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
)(BlockPopup);
