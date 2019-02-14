// @flow

import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type {
  ReduxState,
  Candidate,
  UserProfile,
  SceneCandidates,
  GetSceneCandidatesInProgress,
  Scene
} from 'mobile/reducers/index';
import getSceneCandidatesAction from 'mobile/actions/app/getSceneCandidates';
import { routes } from 'mobile/components/Navigation';
import PreviewCard from 'mobile/components/shared/PreviewCard';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { Colors } from 'mobile/styles/colors';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import DevTesting from 'mobile/utils/DevTesting';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import type { swipeDirection } from './Deck';
import Deck from './Deck';

type navigationProps = {
  navigation: any
};

type reduxProps = {
  sceneCandidates: SceneCandidates,
  getSceneCandidatesInProgress: GetSceneCandidatesInProgress
};

type dispatchProps = { getSceneCandidates: (scene: Scene) => void };

type Props = reduxProps & navigationProps & dispatchProps;

type State = {
  swipeGestureInProgress: boolean
};

function mapStateToProps(reduxState: ReduxState): reduxProps {
  return {
    sceneCandidates: reduxState.sceneCandidates,
    getSceneCandidatesInProgress: reduxState.inProgress.getSceneCandidates
  };
}

function mapDispatchToProps(dispatch: Dispatch): dispatchProps {
  return {
    getSceneCandidates: (scene: Scene) => {
      dispatch(getSceneCandidatesAction(scene));
    }
  };
}

class SwipingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      swipeGestureInProgress: false
    };
  }

  componentWillMount() {
    const {
      sceneCandidates,
      getSceneCandidatesInProgress,
      getSceneCandidates
    } = this.props;
    if (!getSceneCandidatesInProgress.smash && sceneCandidates.smash === null) {
      getSceneCandidates('smash');
    }
  }

  _renderCard = (profile: UserProfile) => {
    const { navigation } = this.props;
    return (
      <PreviewCard
        profile={profile}
        onCardTap={() =>
          navigation.navigate(routes.ExpandedCard, {
            profile,
            onMinimize: () => navigation.pop()
          })
        }
      />
    );
  };

  _renderEmpty = () => <Text>Too picky</Text>;

  _onSwipeStart = () => {
    DevTesting.log('swiping');
  };

  _onSwipeRight = (user: Candidate) => {
    DevTesting.log(`Card liked: ${user.profile.fields.displayName}`);
  };

  _onSwipeLeft = (user: Candidate) => {
    DevTesting.log(`Card disliked: ${user.profile.fields.displayName}`);
  };

  _onSwipeComplete = () => {
    this.setState({ swipeGestureInProgress: false });
  };

  _onPressSwipeButton = (swipeDirection: swipeDirection) => {
    const { swipeGestureInProgress } = this.state;

    this.setState({ swipeGestureInProgress: true }, () => {
      if (this.deck) {
        this.deck._forceSwipe(swipeDirection, 750);
      } else {
        throw new Error('this.deck is null in Cards_Screen');
      }
    });
  };

  _onSwipeLike = () => {
    this._onPressSwipeButton('right');
  };

  _onSwipeDislike = () => {
    this._onPressSwipeButton('left');
  };

  deck: ?Deck;

  render() {
    const { sceneCandidates, getSceneCandidatesInProgress } = this.props;
    // If we are fetching scene candidates or haven't fetched any yet
    // TODO: Show loading animation
    if (getSceneCandidatesInProgress.smash || sceneCandidates.smash === null) {
      return (
        <View>
          <Text>LOADING</Text>
        </View>
      );
    }

    if (sceneCandidates.smash === null || sceneCandidates.smash === undefined) {
      throw new Error('Smash candidates is null or undefined');
    }

    return (
      <Transition inline appear="scale">
        <View style={{ flex: 1 }}>
          <GEMHeader
            title="PROJECTGEM"
            rightIconName="message"
            leftIconName="user"
          />
          <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Deck
              ref={deck => (this.deck = deck)}
              data={sceneCandidates.smash}
              renderCard={this._renderCard}
              renderEmpty={this._renderEmpty}
              onSwipeStart={this._onSwipeStart}
              onSwipeRight={this._onSwipeRight}
              onSwipeLeft={this._onSwipeLeft}
              onSwipeComplete={this._onSwipeComplete}
              infinite
              disableSwipe={false}
            />
            <TouchableOpacity
              onPress={() => this._onPressSwipeButton('left')}
              style={Arthur_Styles.swipeButton_dislike}
            >
              <CustomIcon name="delete-filled" size={65} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this._onPressSwipeButton('right')}
              style={Arthur_Styles.swipeButton_like}
            >
              <CustomIcon
                name="heart-filled"
                size={65}
                color={Colors.Grapefruit}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Transition>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwipingScreen);
