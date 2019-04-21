// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { type NavigationScreenProp } from 'react-navigation';
import GEMHeader from 'mobile/components/shared/Header';
import { textStyles } from 'mobile/styles/textStyles';
import KeyboardView from 'mobile/components/shared/KeyboardView';
import { WebBrowser } from 'expo';
import { Colors } from 'mobile/styles/colors';

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type Props = NavigationProps;

type State = {};

class TerminatedScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation } = this.props;
    const isUnder18 = navigation.getParam('isUnder18', false);
    return (
      <View style={{ flex: 1 }}>
        <KeyboardView waves={1}>
          <View style={{ flex: 1, paddingHorizontal: '6.4%' }}>
            <GEMHeader title="" />
            <Text style={[textStyles.headline4Style, { textAlign: 'center' }]}>
              {isUnder18
                ? "You're too Young."
                : 'Your Account Has Been Terminated'}
            </Text>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-around',
                paddingBottom: '25%'
              }}
            >
              <Text style={textStyles.body1Style}>
                {isUnder18
                  ? 'Your account has been terminated. As stated in the '
                  : 'Your account has been terminated for violating the '}
                <Terms />
                {isUnder18
                  ? ', you must be at least 18 years old to use the app. You won’t be able to log into this account and no one else will be able to see it.'
                  : '. You won’t be able to log into this account and no one else will be able to see it.'}
              </Text>
              <Text style={textStyles.body1Style}>
                {isUnder18
                  ? 'If you think this is a mistake, please reach out to support@jumbosmash.com and let the team know. As per the '
                  : 'As per the '}
                <Terms />
                {isUnder18
                  ? ', JumboSmash reserves the right to make the final determination with respect to such matters, and this decision may not be reversed.'
                  : ', JumboSmash reserves the right to make the final determination with respect to such matters, and this decision will not be reversed.'}
              </Text>
              {!isUnder18 && (
                <Text style={textStyles.body1Style}>
                  {'Congrats to you and the rest of the class of 2019! 🥂🎓🐘'}
                </Text>
              )}
            </View>
            <AndroidBackHandler onBackPress={() => true} />
          </View>
        </KeyboardView>
      </View>
    );
  }
}

const Terms = () => (
  <Text
    style={{
      color: Colors.Grapefruit,
      textDecorationLine: 'underline'
    }}
    onPress={() => {
      WebBrowser.openBrowserAsync('https://jumbosmash.com/terms.html');
    }}
  >
    {' '}
    Terms and Conditions
  </Text>
);

export default TerminatedScreen;
