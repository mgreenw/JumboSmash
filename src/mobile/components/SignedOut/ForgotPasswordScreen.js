// @flow

import React from 'react';
import { Alert, Linking, StyleSheet, TextInput, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements';
import {connect} from 'react-redux';

type Props = {
  navigation: any,
};

function mapStateToProps(state, ownProps) {
  console.log(state);
    return {};
}

function mapDispatchToProps(dispatch, ownProps) {
    return {};
}

class ForgotPasswordScreen extends React.Component<Props> {

    // These are for react navigation, like header bar and such
    // These are for react navigation, like header bar and such
    static navigationOptions = ({navigation}: any) => ({
        headerLeft: navigation.state.params.headerLeft,
        title: 'Forgot Password',
    });

    render() {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Forgot Password Screen</Text>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen);
