import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements';

export default class BarScreen extends React.Component {

  // These are for react navigation, like header bar and such
  static navigationOptions = {
    title: 'Bar',
      headerStyle: {
        backgroundColor: '#272727',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
};

  render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
      // An example of how to use flex to get 2 vetrically aligned boxes with things in the middles
      <View style={{ flex: 1, alignItems: 'center', }}>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', }}>
          <Text> Bar Screen </Text>
        </View>
      </View>
    );
  }
}
