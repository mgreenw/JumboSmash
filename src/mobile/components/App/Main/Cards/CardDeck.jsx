// @flow
import React from 'react';
import {
  View,
  Platform,
  Image,
  InteractionManager,
  Dimensions,
  Animated,
  Text
} from 'react-native';
import { PrimaryButton } from 'mobile/components/shared/buttons';
import type {
  ReduxState,
  Scene,
  Dispatch,
  UserProfile
} from 'mobile/reducers/index';
import { connect } from 'react-redux';
import Swiper from 'react-native-deck-swiper';
import { NavigationEvents } from 'react-navigation';

import getSceneCandidatesAction from 'mobile/actions/app/getSceneCandidates';
import judgeSceneCandidateAction from 'mobile/actions/app/judgeSceneCandidate';
import ActionSheet from 'mobile/components/shared/ActionSheet';
import { Colors } from 'mobile/styles/colors';
import ModalProfileView from 'mobile/components/shared/ModalProfileView';
import ModalMatchOverlay from 'mobile/components/shared/ModalMatchOverlay';
import { textStyles } from 'mobile/styles/textStyles';
import PreviewCard from './CardViews/PreviewCard';
import InactiveSceneCard from './CardViews/InactiveSceneCard';
import SwipeButtons, { SWIPE_BUTTON_HEIGHT } from './SwipeButtons';

import BlockPopup from '../Matches/BlockPopup';
import ReportPopup from '../Matches/ReportPopup';

const ArthurLoadingGif = require('../../../../assets/arthurLoading.gif');
const ArthurLoadingFrame1 = require('../../../../assets/arthurLoadingFrame1.png');

type ProfileCard = {
  type: 'PROFILE',
  profileId: number
};

type InactiveCard = {
  type: 'INACTIVE'
};

type Card = InactiveCard | ProfileCard;

type ProppyProps = {
  scene: Scene
};

type ReduxProps = {
  profileCards: ProfileCard[],
  getCandidatesInProgress: boolean,
  profileMap: { [userId: number]: UserProfile },
  overlayMatchId: ?number,
  clientProfile: ?UserProfile
};

type DispatchProps = {
  getMoreCandidates: () => void,
  getMoreCandidatesAndReset: () => void,
  dislike: (candidateUserId: number) => void,
  like: (canidateUserId: number) => void
};

type Props = ProppyProps & DispatchProps & ReduxProps;
type State = {
  cards: Card[],
  deckIndex: number,
  allSwiped: boolean,
  noCandidates: boolean,
  showExpandedCard: boolean,
  expandedCardProfile: ?UserProfile,
  expandedCardUserId: ?number,
  showUserActionSheet: boolean,
  showBlockPopup: boolean,
  showReportPopup: boolean,
  showGif: boolean,
  // Animation
  swipeAnim: Animated.Value,
  showOverlayMatch: boolean,
  overlayMatchProfile: ?UserProfile
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props): ReduxProps {
  const { scene } = ownProps;
  const profileCards: ProfileCard[] = reduxState.sceneCandidateIds[scene].map(
    profileId => {
      return {
        type: 'PROFILE',
        profileId
      };
    }
  );
  if (!reduxState.client) {
    throw new Error('client is null in Cards Screen');
  }

  const overlayMatchId =
    // For flow typing the parsing
    reduxState.topToast.code === 'NEW_MATCH' &&
    // Ensure matched in same scene.
    ownProps.scene === reduxState.topToast.scene &&
    // Ensure client initated this.
    reduxState.topToast.clientInitiatedMatch === true
      ? reduxState.topToast.userId
      : null;

  const { profile: clientProfile = null } = reduxState.client;
  return {
    profileCards,
    getCandidatesInProgress: reduxState.inProgress.getSceneCandidates[scene],
    profileMap: reduxState.profiles,
    overlayMatchId,
    clientProfile
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): DispatchProps {
  const { scene } = ownProps;
  return {
    getMoreCandidates: () => {
      dispatch(getSceneCandidatesAction(scene));
    },
    getMoreCandidatesAndReset: () => {
      dispatch(getSceneCandidatesAction(scene, true));
    },
    like: (candidateUserId: number) => {
      dispatch(judgeSceneCandidateAction(candidateUserId, scene, true));
    },
    dislike: (candidateUserId: number) => {
      dispatch(judgeSceneCandidateAction(candidateUserId, scene, false));
    }
  };
}

class cardDeck extends React.Component<Props, State> {
  constructor(props: Props) {
    const inactiveCard: InactiveCard = {
      type: 'INACTIVE'
    };
    super(props);
    this.state = {
      cards: [inactiveCard, ...props.profileCards],
      deckIndex: 0,
      allSwiped: false,
      noCandidates: false, // wait until we check -- allow a load
      showExpandedCard: false,
      expandedCardProfile: null,
      expandedCardUserId: null,
      showUserActionSheet: false,
      showBlockPopup: false,
      showReportPopup: false,
      showGif: false,
      swipeAnim: new Animated.Value(0),
      showOverlayMatch: false,
      overlayMatchProfile: null
    };
  }

  componentDidUpdate(prevProps: Props) {
    // If a new match initiated by user here, toggle the overlay.
    // Don't toggle if viewing a profile, or another one up.
    const {
      profileCards,
      getCandidatesInProgress,
      overlayMatchId,
      profileMap
    } = this.props;
    const { showExpandedCard, showOverlayMatch } = this.state;

    if (
      overlayMatchId &&
      overlayMatchId !== prevProps.overlayMatchId &&
      showExpandedCard === false &&
      showOverlayMatch === false
    ) {
      const newOverlayMatchProfile = profileMap[overlayMatchId];
      if (newOverlayMatchProfile !== undefined) {
        this.setState({
          showOverlayMatch: true,
          // Map the overlay from props to state.
          // If a new match occurs, we still want to show the old overlay
          overlayMatchProfile: newOverlayMatchProfile
        });
      }
    }

    // We use this to MUTATE the 'cards' array in this component's state.
    // This is needed as the swiper uses a REFERENCE to the original array.
    const recievedNewCanidates =
      prevProps.getCandidatesInProgress && !getCandidatesInProgress;
    if (recievedNewCanidates) {
      if (prevProps.profileCards !== profileCards) {
        const { cards, allSwiped, deckIndex } = this.state;
        const len = cards.length;
        // keep the card this componenet adds (the genesis) and append the rest
        cards.splice(1, len, ...profileCards);
        if (allSwiped) {
          // at this point deckIndex will be length + 1 if no new cards are fetched.
          const noCandidates = deckIndex > profileCards.length;
          if (noCandidates) {
            this.setState({
              noCandidates,
              allSwiped: true // should stay true
            });
          } else {
            this.setState(
              {
                allSwiped: false,
                noCandidates
              },
              () => {
                // The magic. This actually dosn't move the deckIndex, but forces the swiper to update its props.
                // This is only used in the case we have hit the end of the deck.
                this.swiper.jumpToCardIndex(deckIndex);
              }
            );
          }
        }
      }
    }
  }

  _onSwiped = (deckIndex: number) => {
    this.setState({
      deckIndex: deckIndex + 1
    });
  };

  _onDragEnd = () => {
    const { swipeAnim } = this.state;

    Animated.spring(swipeAnim, {
      toValue: 0
    }).start();
  };

  // Render the correct card based on the type.
  // For now, we just have two:
  //    1. the first card of the deck, used to active swiping
  //       (and enable swiping if needed via settings)
  //    2. the preview profile card.
  _renderCard = (card: Card) => {
    switch (card.type) {
      case 'INACTIVE': {
        const { scene } = this.props;
        return (
          <InactiveSceneCard
            scene={scene}
            dismissCard={() => {
              this.swiper.swipeBottom();
            }}
          />
        );
      }
      case 'PROFILE': {
        const { profileMap } = this.props;
        const profile = profileMap[card.profileId];
        return <PreviewCard profile={profile} />;
      }
      default: {
        // eslint-disable-next-line no-unused-expressions
        (card.type: empty); // ensures we have handled all cases
        return null;
      }
    }
  };

  _onSwipedAll = () => {
    const { getMoreCandidates } = this.props;
    this.setState(
      {
        allSwiped: true
      },
      () => {
        // Force the loading to show for a second.
        // This is a nice way to guarentee request ammounts.
        setTimeout(() => {
          getMoreCandidates();
        }, 1000);
      }
    );
  };

  // These are callbacks for after swiping
  _onSwipedLeft = (deckIndex: number) => {
    const { dislike } = this.props;
    const { cards } = this.state;
    const card = cards[deckIndex];
    if (card.type === 'PROFILE') {
      dislike(card.profileId);
    }
  };

  _onSwipedRight = (deckIndex: number) => {
    const { like } = this.props;
    const { cards } = this.state;
    const card = cards[deckIndex];
    if (card.type === 'PROFILE') {
      like(card.profileId);
    }
  };

  // These cause swipes to occur, for faking a swipe from a button
  _onButtonLike = (HorizontalSwipeThreshold: number) => {
    this._fakeSwipeAnimation(HorizontalSwipeThreshold, 'RIGHT');
    this.swiper.swipeRight();
  };

  _onButtonDislike = (HorizontalSwipeThreshold: number) => {
    this._fakeSwipeAnimation(HorizontalSwipeThreshold, 'LEFT');
    this.swiper.swipeLeft();
  };

  _onTapCard = (deckIndex: number) => {
    const { cards } = this.state;
    const card = cards[deckIndex];
    if (card.type === 'PROFILE') {
      this._showExpandedCard(card.profileId);
    }
  };

  _showExpandedCard = (profileId: number) => {
    const { profileMap } = this.props;
    const profile = profileMap[profileId];
    this.setState({
      showExpandedCard: true,
      expandedCardUserId: profileId,
      expandedCardProfile: profile
    });
  };

  _hideExpandedCard = () => {
    this.setState({
      showExpandedCard: false
    });
  };

  _toggleUserActionSheet = (overide?: boolean) => {
    this.setState(state => {
      const showUserActionSheet = overide || !state.showUserActionSheet;
      return {
        showUserActionSheet
      };
    });
  };

  _onStartChatting = () => {};

  _onKeepSwiping = () => {
    this.setState({
      showOverlayMatch: false
    });
  };

  _fakeSwipeAnimation(
    HorizontalSwipeThreshold: number,
    direction: 'RIGHT' | 'LEFT'
  ) {
    const { swipeAnim } = this.state;
    Animated.sequence([
      Animated.timing(swipeAnim, {
        toValue:
          direction === 'LEFT'
            ? -HorizontalSwipeThreshold
            : HorizontalSwipeThreshold,
        duration: 200
      }),
      Animated.spring(swipeAnim, {
        toValue: 0
      })
    ]).start();
  }

  _renderUserActionSheet() {
    const { showUserActionSheet } = this.state;
    return (
      <ActionSheet
        visible={showUserActionSheet}
        options={[
          {
            text: 'Block',
            onPress: () => {
              this.setState({
                showUserActionSheet: false,
                showBlockPopup: true
              });
            },
            textStyle: {
              color: Colors.Grapefruit
            }
          },
          {
            text: 'Report',
            onPress: () => {
              this.setState({
                showUserActionSheet: false,
                showReportPopup: true
              });
            },
            textStyle: {
              color: Colors.Grapefruit
            }
          }
        ]}
        cancel={{
          text: 'Cancel',
          onPress: () => {
            this._toggleUserActionSheet(false);
          }
        }}
      />
    );
  }

  _renderBlockPopup() {
    const {
      showBlockPopup,
      expandedCardUserId,
      expandedCardProfile
    } = this.state;
    const displayName = expandedCardProfile
      ? expandedCardProfile.fields.displayName
      : '';

    return (
      <BlockPopup
        visible={showBlockPopup}
        onCancel={() => this.setState({ showBlockPopup: false })}
        onDone={() =>
          this.setState({ showBlockPopup: false }, () =>
            this.swiper.swipeBottom()
          )
        }
        displayName={displayName}
        userId={expandedCardUserId}
      />
    );
  }

  _renderReportPopup() {
    const {
      showReportPopup,
      expandedCardUserId,
      expandedCardProfile
    } = this.state;
    const displayName = expandedCardProfile
      ? expandedCardProfile.fields.displayName
      : '';

    return (
      <ReportPopup
        visible={showReportPopup}
        onCancel={() => this.setState({ showReportPopup: false })}
        onDone={block =>
          this.setState(
            { showReportPopup: false },
            () => block && this.swiper.swipeBottom()
          )
        }
        displayName={displayName}
        userId={expandedCardUserId}
      />
    );
  }

  swiper: Swiper;

  render() {
    const {
      cards,
      deckIndex,
      allSwiped,
      noCandidates,
      showExpandedCard,
      expandedCardProfile,
      showGif,
      swipeAnim,
      showOverlayMatch,
      overlayMatchProfile
    } = this.state;
    const {
      getCandidatesInProgress,
      getMoreCandidatesAndReset,
      clientProfile,
      scene
    } = this.props;
    const { width } = Dimensions.get('window');
    // This is the default for the swiper
    const HorizontalSwipeThreshold = width / 4;

    const renderSwiper = (
      <Swiper
        ref={swiper => {
          this.swiper = swiper;
        }}
        cards={cards}
        renderCard={this._renderCard}
        onSwiped={this._onSwiped}
        onSwipedLeft={this._onSwipedLeft}
        onSwipedRight={this._onSwipedRight}
        onSwipedAll={this._onSwipedAll}
        dragEnd={this._onDragEnd}
        verticalSwipe={false}
        horizontalSwipe={
          deckIndex !== 0 /* don't allow the instructions to be swiped */
        }
        backgroundColor={'transparent'}
        deckIndex={deckIndex}
        stackSize={2}
        cardVerticalMargin={0}
        cardHorizontalMargin={0}
        stackSeparation={0}
        marginBottom={60 /* TODO: MAKE THIS EXACT SAME AS THE HEADER */}
        stackScale={10}
        useViewOverflow={Platform.OS === 'ios'}
        onTapCard={this._onTapCard}
        onSwiping={pos => {
          swipeAnim.setValue(pos);
        }}
      />
    );

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1
        }}
      >
        <NavigationEvents
          onDidFocus={() => {
            InteractionManager.runAfterInteractions(() => {
              this.setState({
                showGif: true
              });
            });
          }}
          onWillBlur={() => {
            this.setState({
              showGif: false
            });
          }}
        />
        {/* {renderSwiper} */}
        <View
          style={{
            /* Absolutely absurd we have to do this, but the Swiper does not
               correctly propogate props to its children, so we have to fake locations. */
            zIndex: 2,
            alignContent: 'center',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <Text
            style={[
              textStyles.headline6Style,
              { marginBottom: -width / 4, zIndex: 2 }
            ]}
          >
            Someone’s good with their hands;)
          </Text>
          <View
            style={{
              height: width,
              width,
              zIndex: -1,
              backgroundColor: 'red'
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                zIndex: -2,
                width: '100%',
                height: '100%',
                position: 'absolute'
              }}
              source={ArthurLoadingFrame1}
            />
          </View>

          <Text
            style={[
              textStyles.headline6Style,
              { marginTop: -width / 4, zIndex: 2 }
            ]}
          >
            Looks like you’ve swiped through everyone in your stack. Refresh it
            to see the people you swiped left on.
          </Text>
          <View style={{ width: '33%', alignSelf: 'center', zIndex: 2 }}>
            <PrimaryButton
              onPress={getMoreCandidatesAndReset}
              title="Refresh Stack"
              loading={getCandidatesInProgress}
              disabled={getCandidatesInProgress}
            />
          </View>
        </View>
        {/* <View
          style={{
            width: '100%',
            height: '100%',
            alignContent: 'center',
            zIndex: -1,
            position: 'absolute',
            paddingBottom: SWIPE_BUTTON_HEIGHT / 2
          }}
        >
          {showGif && (
            <Image
              resizeMode="contain"
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute'
              }}
              source={ArthurLoadingGif}
            />
          )}
          <Image
            resizeMode="contain"
            style={{
              zIndex: -2,
              width: '100%',
              height: '100%',
              position: 'absolute'
            }}
            source={ArthurLoadingFrame1}
          />
        </View> */}
        {expandedCardProfile && (
          <ModalProfileView
            isVisible={showExpandedCard}
            onSwipeComplete={this._hideExpandedCard}
            onBlockReport={() => {
              this.setState(
                {
                  showExpandedCard: false
                },
                () => {
                  this._toggleUserActionSheet(true);
                }
              );
            }}
            onMinimize={() => {
              this.setState({
                showExpandedCard: false
              });
            }}
            profile={expandedCardProfile}
          />
        )}
        {overlayMatchProfile && clientProfile && (
          <ModalMatchOverlay
            isVisible={showOverlayMatch}
            clientProfile={clientProfile}
            matchProfile={overlayMatchProfile}
            scene={scene}
            onStartChatting={this._onStartChatting}
            onKeepSwiping={this._onKeepSwiping}
          />
        )}
        {deckIndex !== 0 && (
          <SwipeButtons
            disabled={noCandidates || allSwiped || deckIndex === 0}
            onPressDislike={() => {
              this._onButtonDislike(HorizontalSwipeThreshold);
            }}
            onPressLike={() => {
              this._onButtonLike(HorizontalSwipeThreshold);
            }}
            swipeThreshold={HorizontalSwipeThreshold}
            swipeAnimation={swipeAnim}
          />
        )}
        {this._renderUserActionSheet()}
        {this._renderBlockPopup()}
        {this._renderReportPopup()}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(cardDeck);
