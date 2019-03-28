// @flow
import React from 'react';
import { View, Alert } from 'react-native';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import type {
  ReduxState,
  Scene,
  Dispatch,
  UserProfile
} from 'mobile/reducers/index';
import { connect } from 'react-redux';
import Swiper from 'react-native-deck-swiper';

import getSceneCandidatesAction from 'mobile/actions/app/getSceneCandidates';
import judgeSceneCandidateAction from 'mobile/actions/app/judgeSceneCandidate';
import PreviewCard from './CardViews/PreviewCard';
import InactiveSceneCard from './CardViews/InactiveSceneCard';
import SwipeButtons from './SwipeButtons';

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
  profileMap: { [userId: number]: UserProfile }
};

type DispatchProps = {
  getMoreCandidates: () => void,
  dislike: (candidateUserId: number) => void,
  like: (canidateUserId: number) => void
};

type Props = ProppyProps & DispatchProps & ReduxProps;
type State = {
  cards: Card[],
  deckIndex: number,
  allSwiped: boolean,
  noCandidates: boolean
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
  return {
    profileCards,
    getCandidatesInProgress: reduxState.inProgress.getSceneCandidates[scene],
    profileMap: reduxState.profiles
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
      noCandidates: false // wait until we check -- allow a load
    };
  }

  // We use this to MUTATE the 'cards' array in this component's state.
  // This is needed as the swiper uses a REFERENCE to the original array.
  componentDidUpdate(prevProps: Props) {
    const { profileCards, getCandidatesInProgress } = this.props;
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
    this.setState({
      allSwiped: true
    });
    getMoreCandidates();
  };

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

  _onButtonLike = () => {
    this.swiper.swipeRight();
  };

  _onButtonDislike = () => {
    this.swiper.swipeLeft();
  };

  swiper: Swiper;

  render() {
    const { cards, deckIndex, allSwiped, noCandidates } = this.state;
    const { getCandidatesInProgress, getMoreCandidates } = this.props;

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1
        }}
      >
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
        />
        {allSwiped && (
          <View
            style={{
              /* Absolutely absurd we have to do this, but the Swiper does not
               correctly propogate props to its children, so we have to fake locations. */
              position: 'absolute',
              zIndex: 2
            }}
          >
            {noCandidates && (
              <PrimaryButton
                onPress={() => {
                  Alert.alert('Not Yet Implemented');
                }}
                title="Refresh Stack"
                loading={false}
                disabled={false}
              />
            )}
            <PrimaryButton
              onPress={getMoreCandidates}
              title="Load More"
              loading={getCandidatesInProgress}
              disabled={getCandidatesInProgress}
            />
          </View>
        )}
        {deckIndex !== 0 && (
          <SwipeButtons
            disabled={noCandidates || allSwiped || deckIndex === 0}
            onPressDislike={this._onButtonDislike}
            onPressLike={this._onButtonLike}
          />
        )}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(cardDeck);
