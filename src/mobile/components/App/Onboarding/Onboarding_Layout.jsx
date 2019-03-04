// @flow
/* eslint-disable */

import * as React from 'react'; // need this format to access children
import { Text, View } from 'react-native';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { textStyles } from 'mobile/styles/textStyles';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import TertiaryButton from 'mobile/components/shared/buttons/TertiaryButton';
import type { UserSettings, UserProfile } from 'mobile/reducers/index';
import routes from 'mobile/components/navigation/routes';
import GEMHeader from 'mobile/components/shared/Header';
import { Transition } from 'react-navigation-fluid-transitions';
import KeyboardView from 'mobile/components/shared/KeyboardView';
import OnboardingProgress from 'mobile/components/shared/OnboardingProgress';

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
  section: 'profile' | 'settings',
  onSkipPress?: () => void
};
type State = {};

export class OnboardingLayout extends React.Component<Props, State> {
  // TODO: Progress bar
  render() {
    const {
      firstScreen,
      lastScreen,
      infoScreen,
      loading = false,
      onButtonPress,
      title,
      body,
      buttonText,
      progress,
      section,
      buttonDisabled,
      onSkipPress
    } = this.props;
    return (
      <View style={Arthur_Styles.container}>
        <GEMHeader
          leftIconName={firstScreen ? undefined : 'back'}
          title={section === 'settings' ? 'Settings' : 'Profile Setup'}
          loading={loading}
        />
        <KeyboardView waves={1}>
          <View style={{ paddingTop: 20 }}>
            {progress !== undefined && (
              <OnboardingProgress
                progress={progress}
                maxProgress={section === 'settings' ? 1 : 2}
              />
            )}
          </View>
          <Transition inline appear={'horizontal'}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 0.5,
                  justifyContent: 'center',
                  alignItems: 'center'
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
                  paddingLeft:
                    firstScreen || lastScreen || infoScreen ? 25 : 40,
                  paddingRight:
                    firstScreen || lastScreen || infoScreen ? 25 : 40,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {body}
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <PrimaryButton
                  onPress={onButtonPress}
                  title={buttonText || 'Continue'}
                  loading={loading}
                  disabled={buttonDisabled}
                />
                {onSkipPress && (
                  <TertiaryButton onPress={onSkipPress} title={'Skip'} />
                )}
                {onSkipPress && <View /> /* for spacing */}
              </View>
            </View>
          </Transition>
        </KeyboardView>
      </View>
    );
  }
}
