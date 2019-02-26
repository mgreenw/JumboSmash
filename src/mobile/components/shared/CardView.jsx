// @flow

import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated
} from 'react-native';
import type { UserProfile } from 'mobile/reducers/index';
import { getAge } from 'mobile/utils/Birthday';
import { GET_PHOTO__ROUTE } from 'mobile/api/routes';
import { Colors } from 'mobile/styles/colors';
import { Image } from 'mobile/components/shared/imageCacheFork';

type Props = {
  profile: UserProfile,
  onMinimize: () => void
};

const { width } = Dimensions.get('window');

export default class CardView extends React.Component<Props> {
  scrollX = new Animated.Value(0); // this will be the scroll location of our ScrollView

  render() {
    const { profile, onMinimize } = this.props;
    const position = Animated.divide(this.scrollX, width);
    return (
      <ScrollView
        style={{
          backgroundColor: Colors.White,
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View style={{ width, height: width, backgroundColor: 'black' }}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event([
                { nativeEvent: { contentOffset: { x: this.scrollX } } }
              ])}
              scrollEventThrottle={16}
            >
              {profile.photoIds.map(photoId => (
                <Image
                  key={photoId}
                  style={{ width, height: width }}
                  uri={GET_PHOTO__ROUTE + photoId}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {profile.photoIds.map((photoId, i) => {
              const opacity = position.interpolate({
                inputRange: [i - 1, i, i + 1],
                outputRange: [0.4, 1, 0.4],
                extrapolate: 'clamp'
              });
              return (
                <Animated.View
                  key={photoId}
                  style={{
                    opacity,
                    height: 8,
                    width: 8,
                    backgroundColor: '#cccccc',
                    margin: 8,
                    marginTop: -31.5,
                    borderRadius: 5
                  }}
                />
              );
            })}
          </View>
        </View>
        <View
          style={{
            height: '100%',
            backgroundColor: Colors.White,
            shadowColor: '#6F6F6F',
            shadowOpacity: 0.57,
            shadowRadius: 2,
            shadowOffset: {
              height: -1,
              width: 1
            },
            borderRadius: 10,
            marginTop: -10
          }}
          elevation={5}
        >
          <View
            style={{
              marginTop: 18,
              marginBottom: 18
            }}
          >
            <Text style={{ fontSize: 28, textAlign: 'center' }}>
              {`${profile.fields.displayName}, ${getAge(
                profile.fields.birthday
              )}`}
            </Text>
            <TouchableOpacity
              style={{ position: 'absolute', right: 20 }}
              onPress={onMinimize}
            >
              <Text style={{ fontSize: 28 }}>{'<'}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ paddingLeft: 25, paddingRight: 25, paddingBottom: 20 }}
          >
            <Text style={{ textAlign: 'left', fontSize: 18 }}>
              {profile.fields.bio}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
