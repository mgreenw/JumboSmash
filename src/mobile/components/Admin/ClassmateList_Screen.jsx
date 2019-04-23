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
import NavigationService from 'mobile/components/navigation/NavigationService';

const wavesFull = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');

function compareUtln(a: string, b: string) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

type NavigationProps = {
  navigation: NavigationScreenProp<any>
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
  const { classmatesById: classmateMap, classmateIds: unsortedIds } = state;
  const classmateIds = unsortedIds.sort((a, b) =>
    compareUtln(classmateMap[a].utln, classmateMap[b].utln)
  );
  return {
    classmateMap,
    classmateIds,
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

  _onBack = () => {
    NavigationService.enterApp();
  };

  _onPress = (id: number) => {
    const { navigation } = this.props;
    navigation.navigate(routes.AdminClassmateOverview, { id });
  };

  _renderClassmateListItem = (id: number) => {
    const { classmateMap } = this.props;
    // This can fail if classmatesById in reduxState gets out of whack,
    // but this is AdminTooling so we don't have to handle it nicely.
    const classmate: ServerClassmate = classmateMap[id];
    return (
      <ListItem
        onPress={() => {
          this._onPress(id);
        }}
        title={classmate.utln}
      />
    );
  };

  _onBack = () => {
    NavigationService.enterApp();
  };

  render() {
    const { classmateIds, getClassmatesInProgress } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Classmates"
          leftIcon={{ name: 'back', onPress: this._onBack }}
        />
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
