// @flow
import React from 'react';
import { Text, View, Image } from 'react-native';
import { Arthur_Styles } from 'mobile/styles/Arthur_Styles';
import { textStyles } from 'mobile/styles/textStyles';
import GEMHeader from 'mobile/components/shared/Header';
import { PrimaryButton } from 'mobile/components/shared/buttons';
import { Transition } from 'react-navigation-fluid-transitions';
import NavigationService from 'mobile/components/navigation/NavigationService';

const WavesUri = require('../../../assets/waves/waves1/waves.png');

type Props = {
  navigationKey: string,
  bodyText: string,
  onButtonPress: () => void,
  title: string,
  buttonText: string,
  loading: boolean,
  buttonDisabled: boolean
};

export default (props: Props) => {
  const {
    loading,
    onButtonPress,
    title,
    bodyText,
    buttonText,
    buttonDisabled,
    navigationKey
  } = props;
  return (
    <View style={Arthur_Styles.container}>
      <GEMHeader
        title={title}
        leftIcon={{
          name: 'back',
          onPress: () => {
            NavigationService.back(navigationKey);
          }
        }}
        loading={false}
      />
      <Transition inline appear="horizontal">
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1.5 }} />
          <View style={{ flex: 2, paddingLeft: 40, paddingRight: 40 }}>
            <Text style={[textStyles.body1Style, { textAlign: 'center' }]}>
              {bodyText}
            </Text>
          </View>
          <View
            style={{
              alignSelf: 'center',
              flex: 5
            }}
          >
            <PrimaryButton
              onPress={onButtonPress}
              title={buttonText}
              disabled={buttonDisabled}
              loading={loading}
            />
          </View>
        </View>
      </Transition>
      <Transition inline appear="bottom">
        <Image
          resizeMode="stretch"
          source={WavesUri}
          style={Arthur_Styles.waves}
        />
      </Transition>
    </View>
  );
};
