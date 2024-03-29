// @flow

import React from 'react';
import { View, ImageBackground, TouchableHighlight, Text } from 'react-native';
import routes from 'mobile/components/navigation/routes';
import { connect } from 'react-redux';
import GEMHeader from 'mobile/components/shared/Header';
import type { NavigationScreenProp } from 'react-navigation';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import getClassmatesAction from 'mobile/actions/admin/getClassmates';
import getProfileAction from 'mobile/actions/users/getProfile';
import type { ServerClassmate, ProfileStatus } from 'mobile/api/serverTypes';
import { Colors } from 'mobile/styles/colors';
import NavigationService from 'mobile/components/navigation/NavigationService';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { SearchBar } from 'react-native-elements';
import { textStyles } from 'mobile/styles/textStyles';
import { requestPassword } from 'mobile/utils/passwords';

const wavesFull = require('../../assets/waves/wavesFullScreen/wavesFullScreen.png');

const PROFILE_STATUS_COLORS = {
  unreviewed: 'red',
  updated: 'yellow',
  reviewed: 'green'
};

export function profileStatusColor(status: ProfileStatus, hasProfile: boolean) {
  if (hasProfile) return PROFILE_STATUS_COLORS[status];
  return Colors.IceBlue;
}

function compareUtln(a: string, b: string): -1 | 0 | 1 {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function comparePriority(c1: ServerClassmate, c2: ServerClassmate): -1 | 0 | 1 {
  const { hasProfile: hasProfile1, profileStatus: profileStatus1 } = c1;
  const { hasProfile: hasProfile2, profileStatus: profileStatus2 } = c2;

  // no profiles go last
  if (!hasProfile1 && !hasProfile2) return 0;
  if (!hasProfile1) return 1;
  if (!hasProfile2) return -1;

  // if same stay in place
  if (profileStatus1 === profileStatus2) return 0;

  // order: unreviewed -> updated -> reviewed
  if (profileStatus1 === 'unreviewed') return -1;
  if (profileStatus2 === 'unreviewed') return 1;

  if (profileStatus1 === 'updated') return -1;
  if (profileStatus2 === 'updated') return 1;

  if (profileStatus1 === 'reviewed') return -1;
  if (profileStatus2 === 'reviewed') return 1;

  // for flow
  return 0;
}

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};
type DispatchProps = {
  getClassmates: (password: string) => void,
  getProfile: (userId: number) => void
};

type ReduxProps = {
  classmateMap: { [id: number]: ServerClassmate },
  classmateIds: number[],
  getClassmatesInProgress: boolean
};

type Props = DispatchProps & ReduxProps & NavigationProps;

function mapStateToProps(state: ReduxState): ReduxProps {
  const { classmatesById: classmateMap, classmateIds: unsortedIds } = state;
  const classmateIds = unsortedIds
    .filter(a => !classmateMap[a].isTerminated)
    .sort((a, b) => compareUtln(classmateMap[a].utln, classmateMap[b].utln))
    .sort((a, b) => comparePriority(classmateMap[a], classmateMap[b]));
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
    },
    getProfile: (userId: number) => {
      dispatch(getProfileAction(userId));
    }
  };
}

type State = { search: string, classmateIds: number[] };

class ClassmateListScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      search: '',
      classmateIds: props.classmateIds
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { getClassmatesInProgress, classmateIds } = this.props;
    if (
      !getClassmatesInProgress &&
      getClassmatesInProgress !== prevProps.getClassmatesInProgress
    ) {
      // Note: if someone has a search this will show EVERY classmate not the results.
      // Not best behavior, but fine for now.
      this.setState({
        classmateIds
      });
    }
  }

  _renderHeader = () => {
    const { search } = this.state;
    return (
      <SearchBar
        containerStyle={{ backgroundColor: Colors.White }}
        inputContainerStyle={{ backgroundColor: Colors.IceBlue }}
        placeholder="jjaffe01"
        lightTheme
        round
        placeholderTextColor={Colors.Grey80}
        inputStyle={[textStyles.body1Style, { color: Colors.Black }]}
        onChangeText={text => this._onSearchChange(text)}
        autoCorrect={false}
        value={search}
      />
    );
  };

  _onSearchChange = (search: string) => {
    // Show the search immediately
    this.setState({
      search
    });

    const upperCaseSearch = search.toUpperCase();

    const { classmateIds, classmateMap } = this.props;
    const newClassmateIds = classmateIds.filter(id => {
      const { utln } = classmateMap[id];
      return (
        utln.toUpperCase().indexOf(upperCaseSearch) > -1 ||
        id.toString().indexOf(upperCaseSearch) > -1
      );
    });

    this.setState({
      classmateIds: newClassmateIds
    });
  };

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
    requestPassword().then(getClassmates);
  };

  _onBack = () => {
    const { navigation } = this.props;
    NavigationService.back(navigation.state.key);
  };

  _onPress = (id: number) => {
    const { navigation, getProfile } = this.props;
    getProfile(id);
    navigation.navigate(routes.AdminClassmateOverview, { id });
  };

  _renderClassmateListItem = (id: number) => {
    const { classmateMap } = this.props;
    // This can fail if classmatesById in reduxState gets out of whack,
    // but this is AdminTooling so we don't have to handle it nicely.
    const classmate: ServerClassmate = classmateMap[id];
    const {
      utln,
      hasProfile,
      profileStatus,
      capabilities,
      isTerminated
    } = classmate;
    const hasIssues =
      (!capabilities.canBeSwipedOn &&
        (profileStatus === 'update' || profileStatus === 'reviewed')) ||
      !capabilities.canBeActiveInScenes ||
      isTerminated; // isTerminated should be filtered out, this is kinda legacy.
    return (
      <TouchableHighlight
        onPress={() => {
          this._onPress(id);
        }}
        style={{ minHeight: 50 }}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.1,
              backgroundColor: Colors.White,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text>{id}</Text>
          </View>
          <View
            style={{
              flex: 0.25,
              backgroundColor: Colors.Grey85,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text>{utln}</Text>
          </View>
          <View
            style={{
              flex: 0.65,
              backgroundColor: profileStatusColor(profileStatus, hasProfile),
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text>{hasProfile ? profileStatus : 'NO PROFILE'}</Text>
          </View>
          <View
            style={{
              width: 60,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.Grey85
            }}
          >
            <CustomIcon
              name={'attention'}
              size={26}
              color={hasIssues ? 'red' : 'transparent'}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { getClassmatesInProgress } = this.props;
    const { classmateIds } = this.state;
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
          {this._renderHeader()}
          <ColumnTitles />
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

const ColumnTitles = () => {
  return (
    <View
      style={{
        width: '100%',
        height: 40,
        flexDirection: 'row',
        marginVertical: 2
      }}
    >
      <View
        style={{
          flex: 0.1,
          backgroundColor: Colors.White,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text>{'ID'}</Text>
      </View>
      <View
        style={{
          flex: 0.25,
          backgroundColor: Colors.Grey85,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text>{'UTLN'}</Text>
      </View>

      <View
        style={{
          flex: 0.65,
          backgroundColor: Colors.White,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text>{'Profile Status'}</Text>
      </View>
      <View
        style={{
          width: 60,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.Grey85
        }}
      >
        <Text>Issues</Text>
      </View>
    </View>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassmateListScreen);
