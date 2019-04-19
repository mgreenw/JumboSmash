// @flow

import React from 'react';
import { View, ImageBackground } from 'react-native';
import routes from 'mobile/components/navigation/routes';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import GEMHeader from 'mobile/components/shared/Header';
import type { NavigationScreenProp } from 'react-navigation';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';

const wavesFull = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type NavigationProps = {
  navigation: NavigationScreenProp<{}>
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

class ClassmateListScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader title="Classmates" leftIconName="back" />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <Button
            title={'Navigate to Classmate Overview'}
            onPress={() => {
              navigation.navigate(routes.AdminClassmateOverview);
            }}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassmateListScreen);
