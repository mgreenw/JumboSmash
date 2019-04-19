// @flow

import React from 'react';
import { Text, View, ImageBackground, FlatList, AlertIOS } from 'react-native';
import { connect } from 'react-redux';
import GEMHeader from 'mobile/components/shared/Header';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { ListItem } from 'react-native-elements';
import { textStyles } from 'mobile/styles/textStyles';
import type { NavigationScreenProp } from 'react-navigation';
import type { ReduxState, Dispatch } from 'mobile/reducers/index';
import getClassmatesAction from 'mobile/actions/app/getClassmates';

const wavesFull = require('../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type DispatchProps = {
  getClassmates: string => void
};

type ReduxProps = {};

type Props = DispatchProps & ReduxProps;

function mapStateToProps(): ReduxProps {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    getClassmates: (password: string) => {
      dispatch(getClassmatesAction(password));
    }
  };
}

const AdminTempPage = (props: Props) => {
  const { getClassmates } = props;
  AlertIOS.prompt('Enter your password', null, text => {
    getClassmates(text);
  });

  return (
    <View style={{ flex: 1 }}>
      <GEMHeader title="Admin" leftIconName="back" />
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={wavesFull}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
        <FlatList
          data={['test']}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => {
                console.log('pressed');
              }}
              title={item}
            />
          )}
          keyExtractor={code => code}
        />
      </View>
    </View>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminTempPage);
