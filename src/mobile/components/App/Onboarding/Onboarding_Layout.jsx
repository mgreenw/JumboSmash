// @flow
/* eslint-disable */

import * as React from 'react'; // need this format to access children
import { Text, View } from 'react-native';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { textStyles } from 'mobile/styles/textStyles';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import type { UserSettings, UserProfile } from 'mobile/reducers/index';
import { routes } from 'mobile/components/Navigation';
import GEMHeader from 'mobile/components/shared/Header';
import { Transition } from 'react-navigation-fluid-transitions';
import { KeyboardView } from 'mobile/components/shared/KeyboardView';

type Props = {
  body: React.Node,
  onButtonPress: () => void,
  title: string,
  buttonText?: string,
  firstScreen?: boolean,
  lastScreen?: boolean,
  infoScreen?: boolean,
  progress?: number,
  loading?: boolean,
  buttonDisabled?: boolean,
};
type State = {};

export class OnboardingLayout extends React.Component<Props, State> {
  // TODO: Progress bar
  render() {
    const {
      firstScreen,
      lastScreen,
      infoScreen,
      loading,
      onButtonPress,
      title,
      body,
      buttonText,
      progress,
      buttonDisabled,
    } = this.props;
    return (
      <View style={Arthur_Styles.container}>
        <GEMHeader
          leftIconName={firstScreen ? undefined : 'back'}
          title={'Profile Setup'}
          loading={loading}
        />
        <KeyboardView waves={1}>
          <Transition inline appear={'horizontal'}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text
                    style={
                      firstScreen || lastScreen || infoScreen
                        ? textStyles.veganTitle
                        : textStyles.headline5StyleDemibold
                    }
                  >
                    {title}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 2,
                  paddingLeft: firstScreen || lastScreen || infoScreen ? 25 : 40,
                  paddingRight: firstScreen || lastScreen || infoScreen ? 25 : 40,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {body}
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 1 }}>
                  <PrimaryButton
                    onPress={onButtonPress}
                    title={buttonText || 'Continue'}
                    loading={loading}
                    disabled={buttonDisabled}
                  />
                </View>
                <View style={{ flex: 1 }} />
              </View>
            </View>
          </Transition>
        </KeyboardView>
      </View>
    );
  }
}
