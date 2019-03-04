// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Dimensions, Platform } from 'react-native';
import type {
  ReduxState,
  TopToast,
  TopToastCode,
  Scene
} from 'mobile/reducers/index';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import { isIphoneX } from 'mobile/utils/Platform';
import { Constants } from 'expo';
import Toast, { DURATION } from 'react-native-easy-toast';

type ReduxProps = {
  topToast: TopToast
};
type DispatchProps = {};
type Props = ReduxProps & DispatchProps;

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  const { topToast } = reduxState;
  return {
    topToast
  };
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

function iconFromScene(scene: Scene) {
  switch (scene) {
    case 'social': {
      return ' 🐘';
    }

    case 'smash': {
      return ' 🍑';
    }

    case 'stone': {
      return ' 🍀';
    }

    default: {
      // eslint-disable-next-line no-unused-expressions
      (scene: empty); // ensures we have handled all cases
      return '';
    }
  }
}

function messageFromCode(code: TopToastCode): string {
  switch (code) {
    case 'NEW_MESSAGE': {
      return '[picture] [name] sent you a message.';
    }

    case 'NEW_MATCH': {
      return `You have a new match!`;
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
    const { topToast } = this.props;
    const icon =
      topToast.code === 'NEW_MATCH' && topToast.scene
        ? iconFromScene(topToast.scene)
        : '';
    if (topToast.code && topToast.id !== prevProps.topToast.id) {
      const message = messageFromCode(topToast.code) + icon;
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
    let paddingTop;
    if (isIphoneX()) {
      paddingTop = 20;
    } else if (Platform.OS === 'ios') {
      paddingTop = 0;
    } else {
      paddingTop = Constants.statusBarHeight;
    }
    const marginHorizontal = 18;
    return (
      <Toast
        ref={this.setToastRef}
        positionValue={paddingTop + 18}
        position={'top'}
        style={{
          height,
          backgroundColor: Colors.White,
          width: width - marginHorizontal * 2,
          justifyContent: 'center',
          marginHorizontal: 20,
          padding: 15,
          shadowColor: '#6F6F6F',
          shadowOpacity: 0.57,
          shadowRadius: 2,
          shadowOffset: {
            height: 4,
            width: 4
          }
        }}
        textStyle={[textStyles.subtitle1Style, { color: Colors.Black }]}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomToastComponent);
