// @flow
/* eslint-disable */

import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { styles } from 'mobile/styles/template';
import { Button, Card as RneCard, Icon } from 'react-native-elements';
import type { Dispatch } from 'mobile/reducers';
import type { ReduxState } from 'mobile/reducers/index';
import type { UserProfile } from 'mobile/reducers';
import { getAge } from 'mobile/utils/Birthday';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';
import { Image } from 'mobile/components/shared/imageCacheFork';

type Props = {
  profile: UserProfile,
  onCardTap?: () => void
};

type State = {};

const { width } = Dimensions.get('window');

export default class PreviewCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { profile, onCardTap } = this.props;
    return (
      <View
        style={{
          flex: 1,
          margin: 20
        }}
      >
        <View
          style={{
            flex: 2,
            alignItems: 'center'
          }}
        >
          <Image
            key={profile.photoIds[0]}
            style={{
              width: width - 24,
              height: width - 24,
              borderRadius: 20
            }}
            resizeMode={'contain'}
            uri={GET_PHOTO__ROUTE + profile.photoIds[0]}
          />
        </View>
        <TouchableWithoutFeedback onPress={onCardTap}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              padding: 20,
              alignItems: 'center',
              marginTop: -30,
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 20,
              shadowOffset: { width: 1, height: 2 },
              shadowColor: 'black',
              shadowOpacity: 0.2
            }}
          >
            <Text style={{ fontSize: 28 }}>{`${
              profile.fields.displayName
            }, ${getAge(profile.fields.birthday)}`}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
