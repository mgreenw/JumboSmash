// @flow

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Type definitions
type Props = {};
type State = {};

export default class App extends React.Component<Props, State> {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello World</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
