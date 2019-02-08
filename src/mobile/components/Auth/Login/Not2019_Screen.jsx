// @flow
/* eslint-disable */

import React from 'react';
import { Text, View, KeyboardAvoidingView, Image } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { styles } from 'mobile/styles/auth';
import type { Dispatch } from 'redux';
import type { ReduxState } from 'mobile/reducers/index';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { routes } from 'mobile/components/Navigation';

type Props = {
  navigation: any,
};

type State = {
  classYear: number,
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class Not2019Screen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { navigation } = this.props;
    this.state = {
      // TODO: ensure valid number
      classYear: parseInt(navigation.getParam('classYear', '')),
    };
  }

  _onHelp = () => {
    const { navigate } = this.props.navigation;
    navigate(routes.AuthHelp, {});
  };

  render() {
    const yearsLeft = this.state.classYear - 19;

    return (
      <View style={Arthur_Styles.container}>
        <Text style={styles.title}>
          {'Sucks to suck! Try again in ' +
            yearsLeft +
            (yearsLeft == -1 || yearsLeft == 1 ? ' year.' : ' years.')}
        </Text>
        <Button buttonStyle={styles.button} onPress={this._onHelp} title="help" />
        <Image
          resizeMode="stretch"
          source={require('../../../assets/waves/waves1/waves.png')}
          style={Arthur_Styles.waves}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Not2019Screen);
