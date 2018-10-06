// @flow

import React from 'react';
import { Alert, Linking, StyleSheet, TextInput, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button, Input } from 'react-native-elements';

import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  navigation: any,
};

export default class SignupScreen extends React.Component<Props> {

    // These are for react navigation, like header bar and such
    static navigationOptions = {
        title: 'Sign Up',
    };

    _navigateToSplash = () => {
        const { navigate } = this.props.navigation;
        navigate('Splash', {})
    }

    render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>PROJECT GEM</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Input
                            containerStyle={{flex: 1, marginLeft:5}}
                            placeholderTextColor={'#EFEFF3'}
                            inputStyle={{color:'#FFFFFF'}}
                            labelStyle={styles.labelStyle}
                            inputContainerStyle={styles.inputContainerStyle}
                            label='Last Name'
                            placeholder='Bar'
                            onChangeText={(text) => this.setState({lastName: text})}
                            ref = {input=>this.lastNameInput = input }
                            errorMessage = {true ? " " : "Required"}
                    />
                    <Button
                        containerStyle={{flex: 1, justifyContent: 'center'}}
                        buttonStyle={styles.button}
                        onPress = {() => {this._navigateToSplash()}}
                        title="Return to Splash">
                    </Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container : {
      flex: 1,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30,
  },
  title: {
      fontSize: 50,
      letterSpacing: 3,
      textAlign: 'center',
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
  },
  button: {
    marginBottom: 10,
  }
});
