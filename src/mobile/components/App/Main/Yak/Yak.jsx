// @flow

import React from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import type { Yak } from 'mobile/api/serverTypes';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import formatTime from 'mobile/utils/time/formattedTimeSince';
import { Icon } from 'react-native-elements';
import CustomIcon from 'mobile/assets/icons/CustomIcon';

type Props = {
  yak: Yak,
  onPress: () => void,
  onVote: (liked: boolean) => void
};

type VoteButtonProps = {
  direction: 'up' | 'down',
  active: boolean,
  onPress: () => void
};

const VoteButton = ({ direction, active, onPress }: VoteButtonProps) => {
  return (
    <TouchableOpacity
      style={{ padding: 5, margin: -5 }}
      onPress={active ? null : onPress}
    >
      <CustomIcon
        name={direction === 'up' ? 'up-open' : 'down-open'}
        size={20}
        color={active ? Colors.AquaMarine : Colors.Grey80}
      />
    </TouchableOpacity>
  );
};

const YakComponent = (props: Props) => {
  const { yak, onPress, onVote } = props;
  const { clientVote, timestamp, content, score } = yak;
  const formattedTime = formatTime(timestamp);
  const scoreFontSize = (() => {
    if (score >= 1000) return 16;
    if (score >= 100) return 18;
    if (score >= 10) return 20;
    return 22;
  })();
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={Colors.IceBlue}
      style={{
        width: '100%',
        backgroundColor: Colors.White,
        paddingHorizontal: '5.1%',
        paddingVertical: 4
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            flex: 1,
            minHeight: 90,
            alignItems: 'flex-start'
          }}
        >
          <View style={{ flex: 1, paddingTop: 8 }}>
            <Text style={textStyles.body1Style}>{content}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 8,
              paddingBottom: 4
            }}
          >
            <Icon name={'access-time'} size={14} color={Colors.Black} />
            <Text
              style={[
                textStyles.body2Style,
                { color: Colors.Black, paddingLeft: 2 }
              ]}
            >
              {formattedTime}
            </Text>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 10,
            minWidth: 50
          }}
        >
          <VoteButton
            direction={'up'}
            active={clientVote === true}
            onPress={() => {
              onVote(true);
            }}
          />

          <Text
            style={[
              textStyles.headline5Style,
              {
                top: 2,
                color:
                  clientVote === null || clientVote === undefined
                    ? Colors.Black
                    : Colors.AquaMarine,
                fontSize: scoreFontSize,
                lineHeight: 24
              }
            ]}
          >
            {score}
          </Text>
          <VoteButton
            direction={'down'}
            active={clientVote === false}
            onPress={() => {
              onVote(false);
            }}
          />
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default YakComponent;
