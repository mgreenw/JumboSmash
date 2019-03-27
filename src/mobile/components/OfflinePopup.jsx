// @flow

import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import Popup from 'mobile/components/shared/Popup';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import checkInternetAction from 'mobile/actions/checkInternet';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';

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
      <Text
        style={[
          textStyles.headline4StyleMedium,
          {
            color: Colors.Grapefruit,
            textAlign: 'center'
          }
        ]}
      >
        {'No internet connection.'}
      </Text>
      <Text
        style={[
          textStyles.headline6Style,
          {
            color: Colors.Black,
            textAlign: 'center',
            marginBottom: 20
          }
        ]}
      >
        {'Trying to reconnect...'}
      </Text>
      <PrimaryButton
        onPress={() => {
          checkInternet();
        }}
        title={'Check Connection'}
        loading={false}
        disabled={false}
      />
    </Popup>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OfflinePopup);
