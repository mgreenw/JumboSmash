// @flow
/* eslint react/no-unused-state: 0 */

import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import type {
  ReduxState,
  Candidate,
  UserProfile,
  SceneCandidates,
  GetSceneCandidatesInProgress,
  Scene,
  Dispatch
} from 'mobile/reducers';
import getSceneCandidatesAction from 'mobile/actions/app/getSceneCandidates';
import { routes } from 'mobile/components/Navigation';
import PreviewCard from 'mobile/components/shared/PreviewCard';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { Colors } from 'mobile/styles/colors';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import DevTesting from 'mobile/utils/DevTesting';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import type { SwipeDirection } from './Deck';
import Deck from './Deck';

const ArthurLoadingImage = require('../../../../assets/arthurLoading.png');
const ArthurLoadingGif = require('../../../../assets/arthurLoading.gif');

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
  swipeGestureInProgress: boolean,
  loadingSource: string
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
      swipeGestureInProgress: false,
      loadingSource: ArthurLoadingImage
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loadingSource: ArthurLoadingGif }, () => {
        const {
          sceneCandidates,
          getSceneCandidatesInProgress,
          getSceneCandidates
        } = this.props;
        setTimeout(() => {
          if (
            !getSceneCandidatesInProgress.smash &&
            sceneCandidates.smash === null
          ) {
            getSceneCandidates('smash');
          }
        }, 2000);
      });
    }, 1200);
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

  _onPressSwipeButton = (swipeDirection: SwipeDirection) => {
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
    const { loadingSource } = this.state;
    let renderedContent;
    // If we are fetching scene candidates or haven't fetched any yet
    if (getSceneCandidatesInProgress.smash || sceneCandidates.smash === null) {
      renderedContent = (
        <Image
          resizeMode="contain"
          style={{
            flex: 1,
            height: null,
            width: null,
            marginTop: 46,
            marginBottom: 182
          }}
          source={loadingSource}
        />
      );
    } else if (
      sceneCandidates.smash === null ||
      sceneCandidates.smash === undefined
    ) {
      throw new Error('Smash candidates is null or undefined');
    } else {
      renderedContent = (
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
      );
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
            {renderedContent}
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
