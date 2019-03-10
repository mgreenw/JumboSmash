// @flow
/* eslint react/no-unused-state: 0 */

import React from 'react';
import { Text, View, Image } from 'react-native';
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
import type { SwipeDirection } from './Deck';
import SceneSelector from './SceneSelector';
import SwipeButtons from './SwipeButtons';

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
  currentScene: Scene
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
      currentScene: 'smash'
    };
  }

  componentDidMount() {
    this._showLoadingAndFetchCandidates(1200);
  }

  componentDidUpdate(_, prevState: State) {
    const { sceneCandidateIds } = this.props;
    const { currentScene } = this.state;
    if (
      prevState.currentScene !== currentScene &&
      !sceneCandidateIds[currentScene]
    ) {
      this._showLoadingAndFetchCandidates(300);
    }
  }

  _renderCard = (id: number) => {
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

  _onPressSwipeButton = (swipeDirection: SwipeDirection) => {
    const { swipeInProgress } = this.state;
    // Check if swipe is alredy in progress. Prevents user from breaking stuff by spamming the swipe buttons
    if (!swipeInProgress) {
      this.setState({ swipeInProgress: true }, () => {
        if (this.deck) {
          this.deck._forceSwipe(swipeDirection, 750);
        } else {
          throw new Error('this.deck is null in Cards_Screen');
        }
      });
    }
  };

  _onSwipeLike = () => {
    this._onPressSwipeButton('right');
  };

  _onSwipeDislike = () => {
    this._onPressSwipeButton('left');
  };

  _onTapCard = (index: number) => {
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
    return (
      <View
        style={{
          flex: 1,
          marginVertical: 60,
          marginHorizontal: 42,
          alignItems: 'center'
        }}
      >
        <View
          style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
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
            {SCENES[currentScene].display}
          </Text>
        </View>
        <View
          style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}
        >
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
            <Text style={{ fontSize: 69 }}>{SCENES[currentScene].icon}</Text>
          </View>
        </View>
        <View
          style={{
            flex: 2.5,
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <Text style={[textStyles.headline6Style, { textAlign: 'center' }]}>
            {SCENES[currentScene].description}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 2
          }}
        >
          <View style={{ flex: 1 }} />
          <View style={{ flex: 4 }}>
            <PrimaryButton
              onPress={() => NavigationService.navigate(routes.SettingsEdit)}
              title="Go to settings"
              loading={false}
              disabled={false}
            />
          </View>
          <View style={{ flex: 1 }} />
        </View>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
            {`You won’t be shown in ${SCENES[currentScene].display}
unless you turn it on in Settings.`}
          </Text>
        </View>
      </View>
    );
  }

  deck: ?Swiper;

  render() {
    const {
      sceneCandidateIds,
      getSceneCandidatesInProgress,
      clientSettings
    } = this.props;
    const { loadingSource, currentScene } = this.state;

    const isLoading =
      getSceneCandidatesInProgress[currentScene] ||
      sceneCandidateIds[currentScene] === null;

    const isActiveInScene = clientSettings.activeScenes[currentScene] === true;

    let renderedContent;

    if (!isActiveInScene) {
      renderedContent = this._renderNotActiveInScene();
    } else if (isLoading) {
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
      sceneCandidateIds[currentScene] === null ||
      sceneCandidateIds[currentScene] === undefined
    ) {
      throw new Error(`${currentScene} candidates is null or undefined`);
    } else {
      renderedContent = (
        <Swiper
          ref={deck => (this.deck = deck)}
          cards={sceneCandidateIds[currentScene]}
          renderCard={this._renderCard}
          renderEmpty={this._renderEmpty}
          onSwipedRight={this._onSwipeRight}
          onSwipedLeft={this._onSwipeLeft}
          onSwipeComplete={this._onSwipeComplete}
          onTapCard={this._onTapCard}
          backgroundColor={'transparent'}
          stackSize={2}
        />
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
          <View style={{ backgroundColor: 'white', flex: 1 }}>
            {renderedContent}
            {isActiveInScene && (
              <SwipeButtons
                disabled={isLoading}
                onPress={this._onPressSwipeButton}
              />
            )}
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
