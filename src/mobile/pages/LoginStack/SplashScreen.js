// @flow

import React from 'react';
import { Alert, Linking, StyleSheet, TextInput, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements';

type Props = {
  navigation: any,
};

export default class SplashScreen extends React.Component<Props> {

    // These are for react navigation, like header bar and such
    static navigationOptions = {
    };

    _goToLogIn = () => {
        const { navigate } = this.props.navigation;
        navigate('Login', {})
    }

    _goToSignUp = () => {
        const { navigate } = this.props.navigation;
        navigate('Signup', {})
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
                    <Button
                        buttonStyle={styles.button}
                        onPress = {() => {this._goToLogIn()}}
                        containerStyle={{ marginTop: 20 }}
                        title="LOG IN">
                    </Button>

                    <Button
                        buttonStyle={styles.button}
                        onPress = {() => {this._goToSignUp()}}
                        containerStyle={{ marginTop: 20 }}
                        title="SIGN UP">
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
