// @flow
/* eslint-disable */

import React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { styles } from 'mobile/styles/template';
import type { Dispatch } from 'redux';
import type { ReduxState } from 'mobile/reducers/index';
import { routes } from 'mobile/components/Navigation';
import { Transition } from 'react-navigation-fluid-transitions';
import GEMHeader from 'mobile/components/shared/Header';
import { textStyles } from 'mobile/styles/textStyles';
import AvatarList from 'mobile/components/shared/AvatarList';
import Avatar from 'mobile/components/shared/Avatar';
import { ListItem } from 'react-native-elements';

type Props = {
  navigation: any,
};

type State = {};

function mapStateToProps(reduxState: ReduxState, ownProps: Props) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: Props) {
  return {};
}

type item = {
  time: string,
};
const list = [
  { time: '4h' },
  { time: '6h' },
  { time: '6h' },
  { time: '1d' },
  { time: '2d' },
  { time: '2d' },
  { time: '3d' },
];

class MessagingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  keyExtractor = (item: item, index: number) => '' + index;

  renderItem = item => {
    return (
      <TouchableOpacity style={{ height: 90, width: '100%', paddingHorizontal: 15 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginVertical: 11,
            alignItems: 'center',
          }}
        >
          <Avatar size="Small" photoId={10} onPress={() => {}} />
          <View
            style={{
              flex: 1,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              paddingHorizontal: 15,
            }}
          >
            <Text style={textStyles.body1Style}>{'Name'}</Text>
            <Text
              numberOfLines={2}
              style={[textStyles.subtitle1Style, { flex: 1 }]}
            >{`Lorem ipsum dolor sit amet, adipiscing elit. Aenean commodo ligula eget dolor.`}</Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              height: '100%',
            }}
          >
            <Text style={[textStyles.body2Style, { textAlign: 'right' }]}>{item.item.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      <Transition inline appear={'right'}>
        <View style={{ flex: 1 }}>
          <GEMHeader title="Messages" leftIconName={'cards'} />
          <View style={{ flex: 1 }}>
            <FlatList
              ListHeaderComponent={<AvatarList />}
              data={list}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />
          </View>
        </View>
      </Transition>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessagingScreen);
