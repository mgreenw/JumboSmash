// @flow
/* eslint react/no-unused-state: 0 */

import React from 'react';
import { Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import type {
  ReduxState,
  Candidate,
  UserProfile,
  UserSettings,
  SceneCandidates,
  GetSceneCandidatesInProgress,
  Scene,
  Dispatch
} from 'mobile/reducers';
import getSceneCandidatesAction from 'mobile/actions/app/getSceneCandidates';
import judgeSceneCandidateAction from 'mobile/actions/app/judgeSceneCandidate';
import { routes } from 'mobile/components/Navigation';
import PreviewCard from 'mobile/components/shared/PreviewCard';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import DevTesting from 'mobile/utils/DevTesting';
import NavigationService from 'mobile/NavigationService';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import type { SwipeDirection } from './Deck';
import Deck from './Deck';
import SceneSelector from './SceneSelector';
import SwipeButtons from './SwipeButtons';

const ArthurLoadingImage = require('../../../../assets/arthurLoading.png');
const ArthurLoadingGif = require('../../../../assets/arthurLoading.gif');

type navigationProps = {
  navigation: any
};

type reduxProps = {
  sceneCandidates: SceneCandidates,
  getSceneCandidatesInProgress: GetSceneCandidatesInProgress,
  clientSettings: UserSettings
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
    sceneCandidates: reduxState.sceneCandidates,
    getSceneCandidatesInProgress: reduxState.inProgress.getSceneCandidates,
    clientSettings: reduxState.client.settings
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

function capitalizeFirstLetter(string: string) {
  return string[0].toUpperCase() + string.slice(1);
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
    this._showLoadingAndFetchCandidates();
  }

  componentDidUpdate(_, prevState: State) {
    const { sceneCandidates } = this.props;
    const { currentScene } = this.state;
    if (
      prevState.currentScene !== currentScene &&
      !sceneCandidates[currentScene]
    ) {
      this._showLoadingAndFetchCandidates();
    }
  }

  _renderCard = (profile: UserProfile) => {
    return <PreviewCard profile={profile} />;
  };

  _renderEmpty = () => <Text>Too picky</Text>;

  _onSwipeStart = () => {
    DevTesting.log('swiping');
  };

  _onSwipeRight = (user: Candidate) => {
    const { judgeSceneCandidate } = this.props;
    const { currentScene } = this.state;
    judgeSceneCandidate(user.userId, currentScene, true);
    DevTesting.log(`Card liked: ${user.profile.fields.displayName}`);
  };

  _onSwipeLeft = (user: Candidate) => {
    const { judgeSceneCandidate } = this.props;
    const { currentScene } = this.state;
    judgeSceneCandidate(user.userId, currentScene, false);
    DevTesting.log(`Card disliked: ${user.profile.fields.displayName}`);
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

  _onCardTap = (profile: UserProfile) => {
    const { navigation } = this.props;
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

  _showLoadingAndFetchCandidates() {
    setTimeout(() => {
      this.setState({ loadingSource: ArthurLoadingGif }, () => {
        const {
          sceneCandidates,
          getSceneCandidatesInProgress,
          getSceneCandidates
        } = this.props;
        setTimeout(() => {
          const { currentScene } = this.state;
          if (
            !getSceneCandidatesInProgress[currentScene] &&
            sceneCandidates[currentScene] === null
          ) {
            getSceneCandidates(currentScene);
          }
        }, 2000);
      });
    }, 1200);
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
            {` Jumbo${capitalizeFirstLetter(currentScene)}`}
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
            <Text style={{ fontSize: 69 }}>🍑</Text>
          </View>
        </View>
        <View
          style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={[textStyles.headline6Style, { textAlign: 'center' }]}>
            This is where you can match with people to get ~frisky~
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
            {`You won’t be shown in Jumbo${capitalizeFirstLetter(currentScene)}
unless you turn it on in Settings.`}
          </Text>
        </View>
      </View>
    );
  }

  deck: ?Deck;

  render() {
    const {
      sceneCandidates,
      getSceneCandidatesInProgress,
      clientSettings
    } = this.props;
    const { loadingSource, currentScene } = this.state;

    const isLoading =
      getSceneCandidatesInProgress[currentScene] ||
      sceneCandidates[currentScene] === null;

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
      sceneCandidates[currentScene] === null ||
      sceneCandidates[currentScene] === undefined
    ) {
      throw new Error(`${currentScene} candidates is null or undefined`);
    } else {
      renderedContent = (
        <Deck
          ref={deck => (this.deck = deck)}
          data={sceneCandidates[currentScene]}
          renderCard={this._renderCard}
          renderEmpty={this._renderEmpty}
          onSwipeStart={this._onSwipeStart}
          onSwipeRight={this._onSwipeRight}
          onSwipeLeft={this._onSwipeLeft}
          onSwipeComplete={this._onSwipeComplete}
          onCardTap={this._onCardTap}
          infinite
          disableSwipe={isLoading}
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
                onPress={(swipeDirection: SwipeDirection) =>
                  this._onPressSwipeButton(swipeDirection)
                }
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
