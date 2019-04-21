// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import Popup from 'mobile/components/shared/Popup';
import type { ReduxState, Dispatch, PopupCode } from 'mobile/reducers/index';
import { dismissPopup as dismissPopupAction } from 'mobile/actions/popup';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import { SecondaryButton } from 'mobile/components/shared/buttons';

type ReduxProps = {
  errorCode: ?PopupCode
};

type DispatchProps = {
  dismissPopup: () => void
};

type Props = ReduxProps & DispatchProps;

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  return {
    errorCode: reduxState.popupErrorCode
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    dismissPopup: () => {
      dispatch(dismissPopupAction());
    }
  };
}

function messageFromCode(code: PopupCode) {
  switch (code) {
    case 'UNAUTHORIZED': {
      return 'Your session token has expired. Please login again!';
    }

    case 'EXPIRED_VERIFY_CODE': {
      return 'Looks like you were logged out. Please sign in again!';
    }

    case 'SERVER_ERROR': {
      return 'Oops! Something went wrong. Please try again!';
    }

    default: {
      // eslint-disable-next-line no-unused-expressions
      (code: empty); // ensures we have handled all cases
      return '';
    }
  }
}

const MasterPopup = (props: Props) => {
  const { errorCode, dismissPopup } = props;
  const errorMessage = errorCode ? messageFromCode(errorCode) : '';
  return (
    <Popup visible={errorCode !== null} onTouchOutside={dismissPopup}>
      <Text
        style={[
          textStyles.headline4Style,
          {
            color: Colors.Grapefruit,
            textAlign: 'center'
          }
        ]}
      >
        {'Oops.'}
      </Text>
      <Text
        style={[
          textStyles.headline6Style,
          {
            color: Colors.Black,
            textAlign: 'center'
          }
        ]}
      >
        {errorMessage}
      </Text>
      <View
        style={{
          paddingTop: 15,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SecondaryButton title={'Okay'} onPress={dismissPopup} />
      </View>
    </Popup>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MasterPopup);
