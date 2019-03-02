// @flow
import Toast, { DURATION } from 'react-native-easy-toast';
import React from 'react';
import { connect } from 'react-redux';
import type {
  ReduxState,
  Dispatch,
  BottomToastCode
} from 'mobile/reducers/index';

type ReduxProps = {
  bottomToastCode: ?BottomToastCode
};
type DispatchProps = {};
type Props = ReduxProps & DispatchProps;

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  const { bottomToastCode } = reduxState;
  return {
    bottomToastCode
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {};
}

class SettingsToast extends React.Component<Props> {
  componentDidUpdate(prevProps) {
    const { bottomToastCode } = this.props;
    if (bottomToastCode && bottomToastCode !== prevProps.bottomToastCode) {
      this.showToast(bottomToastCode);
    }
  }

  showToast = message => {
    // Focus the text input using the raw DOM API
    if (this.toast) this.toast.show(message);
  };

  setToastRef = element => {
    this.toast = element;
  };

  toast: Toast;

  render() {
    return <Toast ref={this.setToastRef} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsToast);
