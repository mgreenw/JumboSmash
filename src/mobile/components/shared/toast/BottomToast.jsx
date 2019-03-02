// @flow
import Toast, { DURATION } from 'react-native-easy-toast';
import React from 'react';
import { connect } from 'react-redux';
import type {
  ReduxState,
  Dispatch,
  BottomToast,
  BottomToastCode
} from 'mobile/reducers/index';

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

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {};
}

class SettingsToast extends React.Component<Props> {
  componentDidUpdate(prevProps) {
    const { bottomToast } = this.props;
    if (bottomToast.code && bottomToast.id !== prevProps.bottomToast.id) {
      this.showToast(bottomToast.code);
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
