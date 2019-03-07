// @flow

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';

export type Reason = {
  text: string,
  code: string
};

type Props = {
  reasons: Reason[],
  selectedReasons: boolean[],
  onSelect: (reason: Reason, index: number) => void
};

export default (props: Props) => {
  const { reasons, selectedReasons, onSelect } = props;
  return (
    <View>
      {reasons.map((reason, i) => {
        const checked = selectedReasons[i];
        return (
          <View
            style={{ flexDirection: 'row', marginTop: 22 }}
            key={reason.code}
          >
            <TouchableOpacity
              style={{
                width: 32,
                height: 32,
                borderColor: Colors.AquaMarine,
                borderWidth: 2,
                borderRadius: 32,
                paddingTop: 1.5,
                marginRight: 15,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: checked ? Colors.AquaMarine : Colors.White
              }}
              onPress={() => onSelect(reason, i)}
            >
              <CustomIcon name="check" size={16} color={Colors.White} />
            </TouchableOpacity>
            <Text style={textStyles.headline6Style}>{reason.text}</Text>
          </View>
        );
      })}
    </View>
  );
};
