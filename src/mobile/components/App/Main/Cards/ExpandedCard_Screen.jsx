// @flow
/* eslint-disable */

import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { styles } from 'mobile/styles/template';
import { Button, Card as RneCard, Icon } from 'react-native-elements';
import type { Dispatch } from 'redux';
import type { ReduxState } from 'mobile/reducers/index';
import type { UserProfile } from 'mobile/reducers';
import CardView from 'mobile/components/shared/CardView';

type navigationProps = {
  navigation: any,
};

type reduxProps = {};

type dispatchProps = {};

type Props = reduxProps & navigationProps & dispatchProps;

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

class Card extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    const user = navigation.getParam('user', null);
    const onMinimize = navigation.getParam('onMinimize', null);
    if (user === null) {
      {
        throw 'Error: Navigation Param of User is null in Expanded Card Screen';
      }
    }

    if (onMinimize === null) {
      {
        throw 'Error: Navigation Param of OnMinimize is null in Expanded Card Screen';
      }
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <CardView user={navigation.getParam('user')} onMinimize={navigation.getParam('onMinimize')} />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Card);
