// @flow

import * as React from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import { SecondaryButton } from 'mobile/components/shared/buttons/SecondaryButton';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';

type Props = {
  title: string,
  subtitle: string,
  body?: React.Node,
  primaryButtonText: string,
  primaryButtonDisabled?: boolean,
  primaryButtonLoading?: boolean,
  onPrimaryButtonPress: () => void,
  secondaryButtonText?: string,
  secondaryButtonDisabled?: boolean,
  secondaryButtonLoading?: boolean,
  onSecondaryButtonPress?: () => void,
  flexRow?: boolean
};

export default (props: Props) => {
  const {
    title,
    subtitle,
    body,
    primaryButtonText,
    primaryButtonDisabled,
    primaryButtonLoading,
    onPrimaryButtonPress,
    secondaryButtonText,
    secondaryButtonDisabled,
    secondaryButtonLoading,
    onSecondaryButtonPress,
    flexRow = true
  } = props;
  return (
    <KeyboardAvoidingView>
      <View>
        <Text
          style={[
            textStyles.headline4StyleMedium,
            {
              color: Colors.Grapefruit,
              textAlign: 'center'
            }
          ]}
        >
          {title}
        </Text>
        <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
          {subtitle}
        </Text>
        {body || <View style={{ height: 20 }} />}
        <View
          style={{
            flexDirection: flexRow ? 'row' : 'column'
          }}
        >
          {secondaryButtonText && onSecondaryButtonPress && (
            <View style={flexRow ? { flex: 1, paddingRight: 30 } : null}>
              <SecondaryButton
                onPress={onSecondaryButtonPress}
                title={secondaryButtonText}
                loading={secondaryButtonLoading}
                disabled={secondaryButtonDisabled}
              />
            </View>
          )}
          <View style={flexRow ? { flex: 1 } : { marginTop: 20 }}>
            <PrimaryButton
              onPress={onPrimaryButtonPress}
              title={primaryButtonText}
              loading={primaryButtonLoading}
              disabled={primaryButtonDisabled}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
