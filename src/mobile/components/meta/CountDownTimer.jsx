// @flow
import React from 'react';
import { Colors } from 'mobile/styles/colors';
import { Text } from 'react-native';
import { textStyles } from 'mobile/styles/textStyles';
import timeDifference from 'mobile/utils/time/timeDifference';
import * as Animatable from 'react-native-animatable';

function formatTime(
  days: number,
  hours: number,
  minutes: number,
  seconds: number
) {
  if (days > 0) return `${days} D : ${hours} H : ${minutes} M `;
  if (days === 0) return `${hours} H : ${minutes} M : ${seconds} S`;
  return `0 H : 0 M : 0 S`;
}

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

export default class CountDownTimer extends React.Component<Props, State> {
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
    this._pulse();
  };

  _handleViewRef = (ref: Animatable.View) => (this._view = ref);

  _pulse = () => this._view.pulse(800);

  _view: Animatable.View;

  render() {
    const { days, hours, minutes, seconds } = this.state;
    const displayTime = formatTime(days, hours, minutes, seconds);

    return (
      <Animatable.View
        ref={this._handleViewRef}
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
      </Animatable.View>
    );
  }
}
