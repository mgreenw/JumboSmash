// @flow
import React from 'react';
import { Colors } from 'mobile/styles/colors';
import { Text, View } from 'react-native';
import { textStyles } from 'mobile/styles/textStyles';
import timeDifference from 'mobile/utils/time/timeDifference';

type State = {
  timer: any,
  days: number,
  hours: number,
  minutes: number,
  seconds: number
};

type Props = {
  date: Date
};

export default class Loading extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { days, hours, minutes, seconds } = timeDifference(
      new Date(),
      props.date
    );
    this.state = {
      timer: null,
      days,
      hours,
      minutes,
      seconds
    };
  }

  componentDidMount() {
    const timer = setInterval(this.tick, 1000);
    this.setState({ timer });
  }

  componentWillUnmount() {
    const { timer } = this.state;

    // See: https://medium.com/the-react-native-log/getting-eslint-right-in-react-native-bd27524cc77b
    // Esentially this is a Browser API. This is totally safe, but non-standard in react-native untill recently (part of deprecating Mixins)
    // $FlowFixMe
    this.clearInterval(timer);
  }

  tick = () => {
    const { date } = this.props;
    const { days, hours, minutes, seconds } = timeDifference(new Date(), date);
    this.setState({ days, hours, minutes, seconds });
  };

  render() {
    const { days, hours, minutes, seconds } = this.state;
    const displayTime =
      days > 0
        ? `${days} D : ${hours} H : ${minutes} M `
        : `${hours} H : ${minutes} M : ${seconds} S`;
    return (
      <View
        style={{
          backgroundColor: Colors.White,
          paddingHorizontal: 26,
          paddingVertical: 10,
          borderRadius: 4
        }}
      >
        <Text style={[textStyles.headline5Style, { textAlign: 'center' }]}>
          {displayTime}
        </Text>
      </View>
    );
  }
}