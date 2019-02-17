// @flow

import React from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import type { ReduxState, Dispatch, Match } from 'mobile/reducers/index';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import Avatar from 'mobile/components/shared/Avatar';
import type { NavigationScreenProp } from 'react-navigation';

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type ReduxProps = {};

type DispatchProps = {};

type Props = ReduxProps & NavigationProps & DispatchProps;

type State = {
  match: Match
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {};
}

class MessagingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = props;
    const match: ?Match = navigation.getParam('match', null);
    if (match === null || match === undefined) {
      throw new Error('Match null or undefined in Messaging Screen');
    }
    this.state = {
      match
    };
  }

  render() {
    const { match } = this.state;
    return (
      <Transition inline appear="right">
        <View style={{ flex: 1 }}>
          <View>
            <GEMHeader
              title="Messages"
              leftIconName="back"
              rightIconName="heart-filled"
              onRightIconPress={() => {
                Alert.alert('this should be report and stuff?');
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Avatar
              size={'Large'}
              onPress={() => {
                Alert.alert('foo doo bar di doo');
              }}
              photoId={match.profile.photoIds[0]}
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
)(MessagingScreen);
