// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import type {
  ReduxState,
  BottomToast,
  BottomToastCode
} from 'mobile/reducers/index';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';

import Toast, { DURATION } from 'react-native-easy-toast';

type ReduxProps = {
  bottomToast: BottomToast
};
type DispatchProps = {};
type Props = ReduxProps & DispatchProps;

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  const { bottomToast } = reduxState;
  return {
    bottomToast
  };
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

function messageFromCode(code: BottomToastCode): string {
  switch (code) {
    case 'SAVE_SETTINGS__SUCCESS': {
      return 'Your settings have been saved.';
    }

    case 'SAVE_SETTINGS__FAILURE': {
      return 'Settings save failed. Try again.';
    }

    case 'SAVE_PROFILE__SUCCESS': {
      return 'Your profile has been saved.';
    }

    case 'SAVE_PROFILE__FAILURE': {
      return 'Profile save failed. Try again.';
    }

    default: {
      // eslint-disable-next-line no-unused-expressions
      (code: empty); // ensures we have handled all cases
      return '';
    }
  }
}

class BottomToastComponent extends React.Component<Props> {
  componentDidUpdate(prevProps) {
    const { bottomToast } = this.props;
    if (bottomToast.code && bottomToast.uuid !== prevProps.bottomToast.uuid) {
      const message = messageFromCode(bottomToast.code);
      this.showToast(message);
    }
  }

  showToast = message => {
    // Focus the text input using the raw DOM API
    if (this.toast) this.toast.show(message, DURATION.LENGTH_SHORT * 3);
  };

  setToastRef = element => {
    this.toast = element;
  };

  toast: Toast;

  render() {
    const { width } = Dimensions.get('window');
    const height = 55;
    return (
      <Toast
        ref={this.setToastRef}
        positionValue={height + 12}
        style={{
          height,
          backgroundColor: Colors.Offblack,
          width: width - 18 * 2,
          justifyContent: 'center',
          marginHorizontal: 20,
          padding: 15
        }}
        textStyle={[textStyles.subtitle1Style, { color: Colors.White }]}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomToastComponent);
