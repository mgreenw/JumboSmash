// @flow
/* eslint react/no-unused-state: 0 */

import React from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import type {
  ReduxState,
  UserProfile,
  UserSettings,
  SceneCandidateIds,
  GetSceneCandidatesInProgress,
  Scene,
  Dispatch
} from 'mobile/reducers';
import getSceneCandidatesAction from 'mobile/actions/app/getSceneCandidates';
import judgeSceneCandidateAction from 'mobile/actions/app/judgeSceneCandidate';
import routes from 'mobile/components/navigation/routes';
import PreviewCard from 'mobile/components/shared/PreviewCard';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import Swiper from 'react-native-deck-swiper';
import SceneSelector from './SceneSelector';
import SwipeButtons from './SwipeButtons';
import type { SwipeDirection } from './SwipeButtons';

const ArthurLoadingImage = require('../../../../assets/arthurLoading.png');
const ArthurLoadingGif = require('../../../../assets/arthurLoading.gif');

const SCENES = {
  smash: {
    display: 'JumboSmash',
    icon: '🍑',
    description: 'This is where you can match with people to get ~frisky~'
  },
  social: {
    display: 'JumboSocial',
    icon: '🐘',
    description:
      'This is where you can match with people for hanging out - from study buddies to a night out on the town.'
  },
  stone: {
    display: 'JumboStone',
    icon: '🍀',
    description:
      'This is where you can match with people to get blazed out of your mind'
  }
};

type navigationProps = {
  navigation: any
};

type reduxProps = {
  sceneCandidateIds: SceneCandidateIds,
  getSceneCandidatesInProgress: GetSceneCandidatesInProgress,
  clientSettings: UserSettings,
  profileMap: { [userId: number]: UserProfile }
};

type dispatchProps = {
  getSceneCandidates: (scene: Scene) => void,
  judgeSceneCandidate: (
    candidateUserId: number,
    scene: Scene,
    liked: boolean
  ) => void
};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {
  swipeInProgress: boolean,
  loadingSource: string,
  currentScene: Scene,
  index: number
};

function mapStateToProps(reduxState: ReduxState): reduxProps {
  if (!reduxState.client) {
    throw new Error('client is null in Cards Screen');
  }
  return {
    sceneCandidateIds: reduxState.sceneCandidateIds,
    getSceneCandidatesInProgress: reduxState.inProgress.getSceneCandidates,
    clientSettings: reduxState.client.settings,
    profileMap: reduxState.profiles
  };
}

function mapDispatchToProps(dispatch: Dispatch): dispatchProps {
  return {
    getSceneCandidates: (scene: Scene) => {
      dispatch(getSceneCandidatesAction(scene));
    },
    judgeSceneCandidate: (
      candidateUserId: number,
      scene: Scene,
      liked: boolean
    ) => {
      dispatch(judgeSceneCandidateAction(candidateUserId, scene, liked));
    }
  };
}

class SwipingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      swipeInProgress: false,
      loadingSource: ArthurLoadingImage,
      currentScene: 'smash',
      index: 0
    };
    this._onSwipedAll();
  }

  _renderCard = (id: number, index: number) => {
    if (index === 0) {
      return this._renderNotActiveInScene();
    }
    console.log({ index, id });

    const { profileMap } = this.props;
    const profile = profileMap[id];
    return <PreviewCard profile={profile} />;
  };

  _renderEmpty = () => {
    const { getSceneCandidates } = this.props;
    const { currentScene } = this.state;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <View style={{ flex: 1 }} />
        <View style={{ flex: 5 }}>
          <PrimaryButton
            onPress={() =>
              this.setState({ loadingSource: ArthurLoadingGif }, () =>
                getSceneCandidates(currentScene)
              )
            }
            title="Load more candidates"
            loading={false}
            disabled={false}
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  };

  _onSwipeRight = (index: number) => {
    const { judgeSceneCandidate, sceneCandidateIds } = this.props;
    const { currentScene } = this.state;
    const id = sceneCandidateIds[currentScene][index];
    judgeSceneCandidate(id, currentScene, true);
  };

  _onSwipeLeft = (index: number) => {
    const { judgeSceneCandidate, sceneCandidateIds } = this.props;
    const { currentScene } = this.state;
    const id = sceneCandidateIds[currentScene][index];
    judgeSceneCandidate(id, currentScene, false);
  };

  _onSwipeComplete = () => {
    this.setState({ swipeInProgress: false });
  };

  _onSwiped = () => {
    this.setState(prevState => {
      return {
        index: prevState.index + 1
      };
    });
    console.log('swipe');
  };

  _onPressSwipeButton = (swipeDirection: SwipeDirection) => {
    if (this.deck) {
      if (swipeDirection === 'right') {
        this.deck.swipeRight();
      } else if (swipeDirection === 'left') {
        this.deck.swipeLeft();
      }
    } else {
      throw new Error('this.deck is null in Cards_Screen');
    }
  };

  _onSwipeLike = () => {
    this._onPressSwipeButton('right');
  };

  _onSwipeDislike = () => {
    this._onPressSwipeButton('left');
  };

  _onTapCard = (index: number) => {
    if (index === 0) {
      return;
    }
    const { currentScene } = this.state;
    const { profileMap, sceneCandidateIds, navigation } = this.props;
    const id = sceneCandidateIds[currentScene][index];
    const profile = profileMap[id];
    navigation.navigate(routes.CardsExpandedCard, {
      profile,
      onMinimize: () => navigation.pop(),
      swipeButtons: (
        <SwipeButtons
          disabled={false}
          onPress={(swipeDirection: SwipeDirection) => {
            NavigationService.back();
            setTimeout(() => {
              this._onPressSwipeButton(swipeDirection);
            }, 750);
          }}
        />
      )
    });
  };

  _onSwipedAll = () => {
    const { getSceneCandidates } = this.props;
    const { currentScene } = this.state;
    console.log('ALL SWIPED \n GETTING MORE!');
    getSceneCandidates(currentScene);
  };

  _showLoadingAndFetchCandidates(initialTimeout: number) {
    setTimeout(() => {
      this.setState({ loadingSource: ArthurLoadingGif }, () => {
        const {
          sceneCandidateIds,
          getSceneCandidatesInProgress,
          getSceneCandidates
        } = this.props;
        setTimeout(() => {
          const { currentScene } = this.state;
          if (
            !getSceneCandidatesInProgress[currentScene] &&
            sceneCandidateIds[currentScene] === null
          ) {
            getSceneCandidates(currentScene);
          }
        }, 2000);
      });
    }, initialTimeout);
  }

  _renderNotActiveInScene() {
    const { currentScene } = this.state;
    const sceneName = SCENES[currentScene].display;
    const sceneIcon = SCENES[currentScene].icon;
    return (
      <View
        style={{
          flex: 1,
          marginBottom: 150,
          paddingHorizontal: 37,
          alignItems: 'center',
          justifyContent: 'space-evenly',
          backgroundColor: Colors.White,
          borderRadius: 20
        }}
      >
        <Text style={[textStyles.headline5Style, { textAlign: 'center' }]}>
          Welcome to
        </Text>
        <Text
          style={[
            textStyles.jumboSmashStyle,
            { fontSize: 40, padding: 15, textAlign: 'center' }
          ]}
        >
          {sceneName}
        </Text>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: Colors.Grapefruit,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 69 }}>{sceneIcon}</Text>
        </View>
        <Text style={[textStyles.headline6Style, { textAlign: 'center' }]}>
          {SCENES[currentScene].description}
        </Text>
        <PrimaryButton
          onPress={() => {
            // TODO: ensure settings set.
            this.deck.swipeBottom();
          }}
          title={`Enable ${sceneName}`}
          loading={false}
          disabled={false}
        />
        <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
          {`You won’t be shown in ${sceneName} unless you enable it. You can always turn it off in settings.`}
        </Text>
      </View>
    );
  }

  deck: ?Swiper;

  render() {
    const { width } = Dimensions.get('window');
    const {
      sceneCandidateIds,
      getSceneCandidatesInProgress,
      clientSettings
    } = this.props;
    const { loadingSource, currentScene, index } = this.state;
    const isLoading = getSceneCandidatesInProgress[currentScene];

    const isActiveInScene = clientSettings.activeScenes[currentScene] === true;

    let renderedContent;

    if (!isActiveInScene) {
      renderedContent = this._renderNotActiveInScene();
    } else {
      const candidateIds = sceneCandidateIds[currentScene];
      console.log(candidateIds);
      console.log({ index });
      renderedContent = (
        <Swiper
          ref={deck => (this.deck = deck)}
          cards={candidateIds}
          horizontalSwipe={index !== 0}
          verticalSwipe={false}
          renderCard={this._renderCard}
          onSwipedRight={this._onSwipeRight}
          onSwipedLeft={this._onSwipeLeft}
          onSwipeComplete={this._onSwipeComplete}
          onSwipedAll={this._onSwipedAll}
          onSwiped={this._onSwiped}
          onTapCard={this._onTapCard}
          backgroundColor={'transparent'}
          cardVerticalMargin={0}
          cardHorizontalMargin={0}
          cardIndex={0}
          showSecondCard
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: width,
                width
              }}
              source={loadingSource}
            />
          </View>
        </Swiper>
      );
    }

    const sceneSelector = (
      <SceneSelector
        startIndex={1}
        onPress={scene =>
          this.setState({
            currentScene: scene,
            loadingSource: ArthurLoadingImage
          })
        }
        disabled={false}
      />
    );

    return (
      <Transition inline appear="scale">
        <View style={{ flex: 1 }}>
          <GEMHeader
            title="PROJECTGEM"
            rightIconName="message"
            leftIconName="user"
            centerComponent={sceneSelector}
          />
          <View style={{ flex: 1 }}>
            {renderedContent}
            <SwipeButtons
              disabled={isLoading || index === 0}
              onPress={this._onPressSwipeButton}
            />
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
