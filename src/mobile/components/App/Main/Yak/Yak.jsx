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
        paddingHorizontal: '5.1%'
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
            <Text style={textStyles.headline6Style}>{content}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: 4
            }}
          >
            <Icon name={'access-time'} size={14} color={Colors.AquaMarine} />
            <Text
              style={[
                textStyles.body2Style,
                { color: Colors.AquaMarine, paddingLeft: 2 }
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
          <TouchableOpacity
            style={{ padding: 5, margin: -5 }}
            onPress={() => {
              if (clientVote !== true) {
                onVote(true);
              }
            }}
          >
            <CustomIcon
              name={'up-open'}
              size={26}
              color={clientVote === true ? Colors.Grapefruit : Colors.Grey80}
            />
          </TouchableOpacity>
          <Text
            style={[
              textStyles.headline5StyleDemibold,
              {
                top: 2,
                color:
                  clientVote === null || clientVote === undefined
                    ? Colors.Black
                    : Colors.Grapefruit,
                fontSize: scoreFontSize
              }
            ]}
          >
            {score}
          </Text>
          <TouchableOpacity
            style={{ padding: 5, margin: -5 }}
            onPress={() => {
              if (clientVote !== false) {
                onVote(false);
              }
            }}
          >
            <CustomIcon
              name={'down-open'}
              size={26}
              color={clientVote === false ? Colors.Grapefruit : Colors.Grey80}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default YakComponent;
