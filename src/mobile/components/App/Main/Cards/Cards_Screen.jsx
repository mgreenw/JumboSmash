// @flow
/* eslint-disable */

import React from 'react';
import {
  Text,
  View,
  TouchableWithoutFeeback,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import type { Dispatch } from 'redux';
import type { ReduxState } from 'mobile/reducers/index';
import { routes } from 'mobile/components/Navigation';
import Deck from './Deck';
import type { swipeDirection } from './Deck';
import type { UserProfile, Candidate } from 'mobile/reducers';
import PreviewCard from 'mobile/components/shared/PreviewCard';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import NavigationService from 'mobile/NavigationService';
import DevTesting from 'mobile/utils/DevTesting';
import CustomIcon from 'mobile/assets/icons/CustomIcon';

type navigationProps = {
  navigation: any,
};

type reduxProps = {};

type dispatchProps = {};

type Props = reduxProps & navigationProps & dispatchProps;

type State = {
  swipeGestureInProgress: boolean,
};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

//TODO: remove b/c dummy
let DATA: Array<Candidate> = [
  {
    userId: 1,
    profile: {
      fields: {
        displayName: 'Anthony',
        birthday: '21',
        bio: 'BIO',
      },
      photoIds: [],
    },
  },
  {
    userId: 2,
    profile: {
      fields: { displayName: 'Tony', birthday: '22', bio: 'BIO' },
      photoIds: [],
    },
  },
  {
    userId: 3,
    profile: {
      fields: { displayName: 'Ant', birthday: '69', bio: 'BIO' },
      photoIds: [],
    },
  },
  {
    userId: 4,
    profile: {
      fields: { displayName: 'T-dawg', birthday: '47', bio: 'BIO' },
      photoIds: [],
    },
  },
];

class SwipingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      swipeGestureInProgress: false,
    };
  }

  _renderCard = (profile: UserProfile, isTop: boolean) => {
    const { navigation } = this.props;
    return (
      <PreviewCard
        profile={profile}
        onCardTap={() =>
          navigation.navigate(routes.ExpandedCard, {
            profile,
            onMinimize: () => navigation.pop(),
          })
        }
      />
    );
  };

  _renderEmpty = () => {
    return <Text>Too picky</Text>;
  };

  _onSwipeStart = () => {
    DevTesting.log('swiping');
  };

  _onSwipeRight = (user: Candidate) => {
    DevTesting.log('Card liked: ' + user.profile.fields.displayName);
  };

  _onSwipeLeft = (user: Candidate) => {
    DevTesting.log('Card disliked: ' + user.profile.fields.displayName);
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
        throw 'this.deck is null in Cards_Screen';
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
    const { navigation } = this.props;
    return (
      <Transition inline appear={'scale'}>
        <View style={{ flex: 1 }}>
          <GEMHeader
            title="PROJECTGEM"
            rightIconName="message"
            leftIconName="user"
          />
          <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Deck
              ref={deck => (this.deck = deck)}
              data={DATA}
              renderCard={this._renderCard}
              renderEmpty={this._renderEmpty}
              onSwipeStart={this._onSwipeStart}
              onSwipeRight={this._onSwipeRight}
              onSwipeLeft={this._onSwipeLeft}
              onSwipeComplete={this._onSwipeComplete}
              infinite={true}
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
