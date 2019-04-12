// @flow

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';

export type Reason =
  | { text: 'Made me uncomfortable', code: 'UNCOMFORTABLE' }
  | { text: 'Abusive or threatening', code: 'ABUSIVE' }
  | { text: 'Inappropriate content', code: 'INAPPROPRIATE' }
  | { text: 'Bad offline behavior', code: 'BEHAVIOR' }
  | { text: 'Spam or scam', code: 'SPAM' }
  | { text: 'No reason', code: 'NO_REASON' };

export type SelectedReason = {
  reason: Reason,
  selected: boolean
};

type Props = {
  reasons: SelectedReason[],
  onToggle: (selected: boolean, index: number) => void
};

export default (props: Props) => {
  const { reasons, onToggle } = props;
  return (
    <View>
      {reasons.map((selectedReason, i) => {
        const reason = selectedReason.reason;
        const selected = selectedReason.selected;
        return (
          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 22 }}
            key={reason.code}
            onPress={() => onToggle(!selected, i)}
          >
            <View
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
                backgroundColor: selected ? Colors.AquaMarine : Colors.White
              }}
            >
              <CustomIcon name="check" size={16} color={Colors.White} />
            </View>
            <Text style={textStyles.headline6Style}>{reason.text}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
