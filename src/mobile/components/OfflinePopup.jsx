// @flow

import React from 'react';
import { connect } from 'react-redux';
import FormattedPopup from 'mobile/components/shared/Popup_Layout';
import Popup from 'mobile/components/shared/Popup';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import checkInternetAction from 'mobile/actions/checkInternet';

type ReduxProps = {
  isConnected: boolean,
  authLoaded: boolean
};

type DispatchProps = { checkInternet: () => void };

type Props = ReduxProps & DispatchProps;

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  return {
    isConnected: reduxState.network.isConnected,
    authLoaded: reduxState.authLoaded
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    checkInternet: () => {
      dispatch(checkInternetAction());
    }
  };
}

const OfflinePopup = (props: Props) => {
  const { isConnected, authLoaded, checkInternet } = props;
  return (
    <Popup visible={!isConnected && authLoaded} onTouchOutside={() => {}}>
      <FormattedPopup
        onTouchOutside={() => {}}
        title="No internet connection."
        subtitle={'Trying to reconnect...'}
        primaryButtonText={'Check Connection'}
        primaryButtonLoading={false}
        primaryButtonDisabled={false}
        onPrimaryButtonPress={() => {
          checkInternet();
        }}
      />
    </Popup>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OfflinePopup);
