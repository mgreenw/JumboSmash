// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import NavigationService from 'mobile/components/navigation/NavigationService';
import GEMHeader from 'mobile/components/shared/Header';

type NavigationProps = {
  navigation: any
};

type ReduxProps = {};

type DispatchProps = {};

type Props = ReduxProps & NavigationProps & DispatchProps;

type State = {
  postGradLocation: ?string,
  onSave: () => void
};

function mapStateToProps(): ReduxProps {
  return {};
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

class SelectCityScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      postGradLocation: null,
      onSave: navigation.getParam('onSave', null)
    };
  }

  _onBack = () => {
    const { onSave } = this.state;
    onSave();
    NavigationService.back();
  };

  render() {
    const { postGradLocation } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Post-Grad Location"
          leftIconName="back"
          onLeftIconPress={this._onBack}
        />
        <View style={{ flex: 1 }}>
          <Text>{postGradLocation || 'No Selected Location'}</Text>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectCityScreen);
