// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import GEMHeader from 'mobile/components/shared/Header';

type DispatchProps = {};

type ReduxProps = {};

function mapStateToProps(): ReduxProps {
  return {};
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

const AdminTempPage = () => {
  return (
    <View style={{ flex: 1 }}>
      <GEMHeader title="Admin" leftIconName="back" />
      <Text>{'Temp Admin Page'}</Text>
    </View>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminTempPage);
