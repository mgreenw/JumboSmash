// @flow

import React from 'react';
import { View, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import GEMHeader from 'mobile/components/shared/Header';
import type { NavigationScreenProp } from 'react-navigation';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import NavigationService from 'mobile/components/navigation/NavigationService';

const wavesFull = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type DispatchProps = {};

type ReduxProps = {};

type Props = DispatchProps & ReduxProps & NavigationProps;

function mapStateToProps(state: ReduxState): ReduxProps {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {};
}

type State = {};

class ClassmateOverviewScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _onBack = () => {
    const { navigation } = this.props;
    NavigationService.back(navigation.state.key);
  };

  render() {
    const { navigation } = this.props;
    const classmateId: ?number = navigation.getParam('id', null);
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title={`Overview for userId: ${classmateId || 'NOT FOUND'}`}
          leftIcon={{ name: 'back', onPress: this._onBack }}
        />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassmateOverviewScreen);
