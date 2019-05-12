// @flow

import React from 'react';
import {
  View,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity
} from 'react-native';
import GEMHeader from 'mobile/components/shared/Header';
import NavigationService from 'mobile/components/navigation/NavigationService';
import routes from 'mobile/components/navigation/routes';
import type { NavigationScreenProp } from 'react-navigation';
import type { ReduxState, Dispatch } from 'mobile/reducers';
import type { Yak } from 'mobile/api/serverTypes';
import getYaksAction from 'mobile/actions/yaks/getYaks';
import voteYakAction from 'mobile/actions/yaks/voteYak';
import { connect } from 'react-redux';
import { Colors } from 'mobile/styles/colors';
import ActionSheet from 'mobile/components/shared/ActionSheet';
import ReportPopup from 'mobile/components/App/Main/Matches/ReportPopup';
import { textStyles } from 'mobile/styles/textStyles';
import * as Animatable from 'react-native-animatable';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import YakComponent from './Yak';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

const NEW_ICON_HEIGHT = 65;
const NEW_ICON_PADDING = 30;

type SortButtonProps = {
  position: 'left' | 'right',
  active: boolean,
  onPress: () => void,
  title: string
};
const SortButton = ({ position, active, onPress, title }: SortButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: Colors.AquaMarine,
        width: '25%',
        paddingVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: position === 'left' ? 10 : 0,
        borderTopLeftRadius: position === 'left' ? 10 : 0,
        borderBottomRightRadius: position === 'right' ? 10 : 0,
        borderTopRightRadius: position === 'right' ? 10 : 0,
        backgroundColor: active ? Colors.AquaMarine : undefined
      }}
      onPress={onPress}
    >
      <Text
        style={[
          active ? textStyles.body1StyleSemibold : textStyles.body1Style,
          { color: active ? Colors.White : Colors.AquaMarine }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type DispatchProps = {
  getYaks: () => void,
  voteYak: (id: number, liked: boolean) => void
};

type ReduxProps = {
  getYaksInProgress: boolean,
  currentYakIds: { byTime: number[], byScore: number[] },
  yakMap: { [id: number]: Yak }
};

type SortOption = 'score' | 'time';

type Props = NavigationProps & DispatchProps & ReduxProps;
type State = {
  yaksLoaded: boolean,
  /**
   * Used to determine if we are refreshing matches because the user pullled down on the scrollview.
   * If false, then we don't show the animation (causing the load to occur in the background).
   * Default to false when no refresh occuring.
   */
  refreshManuallyTriggered: boolean,
  sortBy: SortOption,
  showActionSheet: boolean,
  showReportPopup: boolean,
  selectedYakId: null | number
};

function mapStateToProps({ yaks }: ReduxState): ReduxProps {
  const { inProgress, byId, currentYakIds } = yaks;
  return {
    getYaksInProgress: inProgress.get,
    currentYakIds: {
      byTime: currentYakIds.slice().reverse(),
      byScore: currentYakIds.slice().sort((a, b) => {
        const { score: scoreA } = byId[a];
        const { score: scoreB } = byId[b];
        if (scoreA > scoreB) return -1;
        if (scoreA < scoreB) return 1;
        return 0;
      })
    },
    yakMap: byId
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    getYaks: () => {
      dispatch(getYaksAction());
    },
    voteYak: (id: number, liked: boolean) => {
      dispatch(voteYakAction(id, liked));
    }
  };
}

/* eslint-disable-next-line no-unused-vars */
class YakListScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      yaksLoaded: false,
      refreshManuallyTriggered: false,
      showActionSheet: false,
      showReportPopup: false,
      selectedYakId: null,
      sortBy: 'score'
    };
  }

  componentDidMount() {
    const { getYaks } = this.props;
    getYaks();
  }

  componentDidUpdate(prevProps: Props) {
    const { getYaksInProgress } = this.props;
    if (prevProps.getYaksInProgress && !getYaksInProgress) {
      // We're doing this safely
      /* eslint-disable-next-line react/no-did-update-set-state */
      this.setState({
        yaksLoaded: true,
        refreshManuallyTriggered: false
      });
    }
  }

  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 3,
          width: '100%'
        }}
      />
    );
  };

  _renderYak = (id: number) => {
    const { yakMap, voteYak } = this.props;
    const yak = yakMap[id];
    return yak ? (
      <YakComponent
        yak={yak}
        onPress={() => {
          this._onPress(id);
        }}
        onVote={liked => {
          voteYak(id, liked);
        }}
      />
    ) : null;
  };

  _onPress = (id: number) => {
    this._toggleActionSheet(true, id);
  };

  /**
   * Set state to refreshing, then call the getYaks Api.
   */
  _onRefresh = () => {
    const { getYaks } = this.props;
    this.setState({ refreshManuallyTriggered: true }, getYaks);
  };

  _toggleActionSheet = (showActionSheet: boolean, selectedYakId?: number) => {
    this.setState({
      showActionSheet,
      selectedYakId: selectedYakId || null
    });
  };

  _renderActionSheet() {
    const { showActionSheet } = this.state;
    const CancelAction = () => {
      this._toggleActionSheet(false);
    };
    const options = [
      {
        text: 'Report',
        onPress: () => {
          this.setState({
            showActionSheet: false,
            showReportPopup: true
          });
        },
        textStyle: {
          color: Colors.Grapefruit
        }
      }
    ];
    return (
      <ActionSheet
        visible={showActionSheet}
        options={options}
        cancel={{
          text: 'Cancel',
          onPress: CancelAction
        }}
      />
    );
  }

  _renderReportPopup() {
    const { showReportPopup, selectedYakId } = this.state;
    if (showReportPopup && selectedYakId === null)
      throw new Error('Yak Id is null in report');

    return (
      <ReportPopup
        visible={showReportPopup}
        onCancel={() => this.setState({ showReportPopup: false })}
        onDone={() => this.setState({ showReportPopup: false })}
        displayName={'this JumboYak'}
        userId={selectedYakId}
        yak
      />
    );
  }

  flatListRef: FlatList;

  render() {
    const { refreshManuallyTriggered, yaksLoaded, sortBy } = this.state;
    const { currentYakIds, navigation } = this.props;
    if (!yaksLoaded) {
      return (
        <View
          style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center'
          }}
        >
          <ActivityIndicator />
        </View>
      );
    }
    const refreshComponent = (
      <RefreshControl
        refreshing={refreshManuallyTriggered}
        onRefresh={this._onRefresh}
      />
    );

    const Header = (
      <View
        style={{
          width: '100%',
          backgroundColor: Colors.White,
          marginTop: 3,
          marginBottom: 3,
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 10
        }}
      >
        <SortButton
          position={'left'}
          active={sortBy === 'time'}
          onPress={() => {
            this.setState({ sortBy: 'time' }, () => {
              this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
            });
          }}
          title={'New'}
        />
        <SortButton
          position={'right'}
          active={sortBy === 'score'}
          onPress={() => {
            this.setState({ sortBy: 'score' }, () => {
              this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
            });
          }}
          title={'Top'}
        />
      </View>
    );

    const TitleComponent = (
      <Text style={textStyles.headline5Style}>
        {'Jumbo'}
        <Text style={textStyles.headline5StyleDemibold}>{'Yak'}</Text>
      </Text>
    );
    const Footer = (
      <View style={{ height: NEW_ICON_HEIGHT + NEW_ICON_PADDING * 2 }} />
    );
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="JumboYak"
          rightIcon={{
            name: 'cards',
            onPress: () => {
              NavigationService.navigate(routes.Cards);
            }
          }}
          leftIcon={{
            name: 'user',
            onPress: () => {
              NavigationService.navigate(routes.Profile);
            }
          }}
          centerComponent={TitleComponent}
        />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          {Header}
          <FlatList
            ref={ref => {
              this.flatListRef = ref;
            }}
            data={
              sortBy === 'time' ? currentYakIds.byTime : currentYakIds.byScore
            }
            renderItem={({ item: id }) => {
              return this._renderYak(id);
            }}
            keyExtractor={id => {
              return `${id}`;
            }}
            ItemSeparatorComponent={this._renderSeparator}
            refreshControl={refreshComponent}
            ListFooterComponent={Footer}
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              padding: NEW_ICON_PADDING,
              justifyContent: 'center',
              elevation: 1,
              shadowColor: Colors.Black,
              shadowOpacity: 0.57,
              shadowRadius: 2,
              shadowOffset: {
                height: 2,
                width: 1
              }
            }}
          >
            <Animatable.View
              animation="swing"
              easing="ease-out"
              iterationCount="infinite"
              iterationDelay={10000}
              delay={10000}
            >
              <View
                style={{
                  width: NEW_ICON_HEIGHT,
                  height: NEW_ICON_HEIGHT,
                  backgroundColor: Colors.Grapefruit,
                  borderRadius: NEW_ICON_HEIGHT,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CustomIcon
                  name={'pencil'}
                  color={Colors.White}
                  size={30}
                  onPress={() => {
                    navigation.navigate(routes.YakNew);
                  }}
                />
              </View>
            </Animatable.View>
          </View>
        </View>
        {this._renderActionSheet()}
        {this._renderReportPopup()}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YakListScreen);
