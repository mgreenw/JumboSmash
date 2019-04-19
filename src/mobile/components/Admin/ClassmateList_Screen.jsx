// @flow

import React from 'react';
import { View, ImageBackground, AlertIOS } from 'react-native';
import routes from 'mobile/components/navigation/routes';
import { connect } from 'react-redux';
import GEMHeader from 'mobile/components/shared/Header';
import type { NavigationScreenProp } from 'react-navigation';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import { ListItem } from 'react-native-elements';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import getClassmatesAction from 'mobile/actions/admin/getClassmates';
import type { ServerClassmate } from 'mobile/api/serverTypes';

const wavesFull = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type NavigationProps = {
  navigation: NavigationScreenProp<{}>
};
type DispatchProps = {
  getClassmates: (password: string) => void
};

type ReduxProps = {
  classmateMap: { [id: number]: ServerClassmate },
  classmateIds: number[],
  getClassmatesInProgress: boolean
};

type Props = DispatchProps & ReduxProps & NavigationProps;

function mapStateToProps(state: ReduxState): ReduxProps {
  return {
    classmateMap: state.classmatesById,
    classmateIds: state.classmateIds,
    getClassmatesInProgress: state.inProgress.getClassmates
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    getClassmates: (password: string) => {
      dispatch(getClassmatesAction(password));
    }
  };
}

type State = {};

class ClassmateListScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%'
        }}
      />
    );
  };

  _onRefresh = () => {
    const { getClassmates } = this.props;
    AlertIOS.prompt('Enter your password', null, text => {
      getClassmates(text);
    });
  };

  _onPress = (id: number) => {
    const { navigation } = this.props;
    navigation.navigate(routes.AdminClassmateOverview, { id });
  };

  _renderClassmateListItem = (id: number) => {
    return (
      <ListItem
        onPress={() => {
          this._onPress(id);
        }}
        title={id.toString()}
      />
    );
  };

  render() {
    const { classmateIds, getClassmatesInProgress } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader title="Classmates" leftIconName="back" />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <KeyboardAwareFlatList
            enableResetScrollToCoords={false}
            data={classmateIds}
            renderItem={({ item: id }: { item: number }) => {
              return this._renderClassmateListItem(id);
            }}
            keyExtractor={id => id.toString()}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={null /* TODO: Header search bar */}
            refreshing={getClassmatesInProgress}
            onRefresh={this._onRefresh}
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
