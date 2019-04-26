// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { ReduxState, Dispatch, Match } from 'mobile/reducers/index';
import UnmatchAction from 'mobile/actions/app/unmatch';
import Popup from 'mobile/components/shared/Popup';
import Layout from 'mobile/components/shared/Popup_Layout';
import InProgress from 'mobile/components/shared/InProgress';

type ProppyProps = {
  visible: boolean,
  displayName: string,
  matchId: number,
  match: Match,
  onCancel: () => void,
  onDone: () => void
};

type ReduxProps = {
  unmatch_inProgress: boolean
};

type DispatchProps = {
  unmatch: (matchId: number) => void
};

type Props = ProppyProps & ReduxProps & DispatchProps;

type State = {
  fakeLoading: boolean
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  if (!reduxState.client) {
    throw new Error('client is null in unmatch popup');
  }
  return {
    unmatch_inProgress: reduxState.inProgress.unmatch
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    unmatch: (matchId: number) => {
      dispatch(UnmatchAction(matchId));
    }
  };
}

class UnmatchPopup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fakeLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { unmatch_inProgress, onDone } = this.props;
    if (unmatch_inProgress && !nextProps.unmatch_inProgress) {
      this.setState({ fakeLoading: true }, () => {
        // The timeout is so the progress bar doesn't look jumpy
        setTimeout(() => {
          onDone();
        }, 500);
      });
    }
  }

  _onUnmatch = () => {
    const { matchId, unmatch } = this.props;
    unmatch(matchId);
  };

  _renderLoading() {
    return <InProgress message={'Unmatching...'} />;
  }

  _renderScenesText() {
    const { match } = this.props;
    const { scenes } = match;
    let matchScenes = [];
    if (scenes.smash) {
      matchScenes = [...matchScenes, 'JumboSmash'];
    }
    if (scenes.social) {
      matchScenes = [...matchScenes, 'JumboSocial'];
    }
    if (scenes.stone) {
      matchScenes = [...matchScenes, 'JumboStone'];
    }

    const length = matchScenes.length;
    return matchScenes.reduce((acc, elem, index) => {
      return acc + (index + 1 !== length ? ', ' : ' and ') + elem;
    });
  }

  _renderConfirm() {
    const { onCancel, displayName } = this.props;
    return (
      <Layout
        title={'Are you sure?'}
        subtitle={`This will unmatch you and ${displayName} in ${this._renderScenesText()}.`}
        primaryButtonText={'Unmatch'}
        primaryButtonDisabled={false}
        primaryButtonLoading={false}
        onPrimaryButtonPress={this._onUnmatch}
        secondaryButtonText={'Cancel'}
        secondaryButtonDisabled={false}
        secondaryButtonLoading={false}
        onSecondaryButtonPress={onCancel}
      />
    );
  }

  render() {
    const { fakeLoading } = this.state;
    const { visible, unmatch_inProgress } = this.props;

    return (
      <Popup visible={visible} onTouchOutside={() => {}}>
        {unmatch_inProgress || fakeLoading
          ? this._renderLoading()
          : this._renderConfirm()}
      </Popup>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnmatchPopup);
