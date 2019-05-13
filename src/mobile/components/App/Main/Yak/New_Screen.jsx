// @flow

import React from 'react';
import { View, Text } from 'react-native';
import GEMHeader from 'mobile/components/shared/Header';
import NavigationService from 'mobile/components/navigation/NavigationService';
import { connect } from 'react-redux';
import type { ReduxState, Dispatch } from 'mobile/reducers';
import postYakAction from 'mobile/actions/yaks/postYak';
import type { NavigationScreenProp } from 'react-navigation';
import BioInput from 'mobile/components/shared/BioInput';
import KeyboardView from 'mobile/components/shared/KeyboardView';
import { textStyles } from 'mobile/styles/textStyles';
import {
  PrimaryButton,
  SecondaryButton
} from 'mobile/components/shared/buttons';
import Popup from 'mobile/components/shared/Popup';
import { Colors } from 'mobile/styles/colors';
import formatTime from 'mobile/utils/time/formattedTimeSince';

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};
type DispatchProps = {
  postYak: (content: string) => void
};
type ReduxProps = {
  postInProgress: boolean,
  nextPostTimestamp: null | string
};
type Props = ReduxProps & DispatchProps & NavigationProps;

type State = {
  content: string,
  showPopup: boolean
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  return {
    postInProgress: reduxState.yaks.inProgress.post,
    nextPostTimestamp: reduxState.yaks.nextPostTimestamp
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    postYak: (content: string) => {
      dispatch(postYakAction(content));
    }
  };
}

class YakNewScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      content: '',
      showPopup: false
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { postInProgress, nextPostTimestamp } = this.props;
    // TODO: consider error handling -- if post fails this still goes back!
    if (!postInProgress && prevProps.postInProgress) {
      if (nextPostTimestamp !== null) {
        this.setState({
          showPopup: true
        });
      } else {
        this._onBack();
      }
    }
  }

  // we intercept errors as notifications to user, not as a lock.
  _onBack = () => {
    const { navigation } = this.props;
    NavigationService.back(navigation.state.key);
  };

  _onChangeContent = (content: string) => {
    this.setState({
      content
    });
  };

  _onSubmit = () => {
    const { postYak } = this.props;
    const { content } = this.state;
    postYak(content);
  };

  _dismissPopup = () => {
    this.setState({
      showPopup: false
    });
  };

  render() {
    const { postInProgress, nextPostTimestamp } = this.props;
    const { content, showPopup } = this.state;
    const loading = postInProgress;

    const TitleComponent = (
      <Text style={textStyles.headline5Style}>
        {'New Jumbo'}
        <Text style={textStyles.headline5StyleDemibold}>{'Yak'}</Text>
      </Text>
    );

    // nextPostTimestamp should not be null whenever this is used, but just in case.
    const timeLeftTillNextPost =
      nextPostTimestamp !== null
        ? formatTime(nextPostTimestamp, true)
        : '1 minute';

    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="New JumboYak"
          leftIcon={{
            name: 'delete-filled',
            onPress: () => {
              this._onBack();
            }
          }}
          centerComponent={TitleComponent}
          loading={loading}
        />
        <KeyboardView waves={1}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 2,
                paddingTop: 20,
                paddingHorizontal: '10.1%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'top'
              }}
            >
              <View
                style={{ flex: 2, justifyContent: 'center', width: '100%' }}
              >
                <View
                  style={{
                    maxHeight: 210,
                    marginBottom: 30,
                    width: '100%'
                  }}
                >
                  <BioInput
                    placeholder="Yaks eat grass"
                    onChangeText={this._onChangeContent}
                    value={content}
                    maxLength={150}
                  />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <PrimaryButton
                  disabled={loading || content.trim().length === 0}
                  loading={loading}
                  title={'Post JumboYak'}
                  onPress={this._onSubmit}
                />
              </View>
            </View>
          </View>
        </KeyboardView>
        <Popup visible={showPopup} onTouchOutside={() => {}}>
          <Text
            style={[
              textStyles.headline4Style,
              {
                color: Colors.Grapefruit,
                textAlign: 'center'
              }
            ]}
          >
            {'👀'}
          </Text>
          <Text
            style={[
              textStyles.headline6Style,
              {
                color: Colors.Black,
                textAlign: 'center'
              }
            ]}
          >
            {"You've posted a lot of Jumbo"}
            <Text styles={textStyles.headline6StyleDemiBold}>Yaks</Text>
            {` recently. Try again in ${timeLeftTillNextPost}.`}
          </Text>
          <View
            style={{
              paddingTop: 15,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SecondaryButton title={'Okay'} onPress={this._dismissPopup} />
          </View>
        </Popup>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YakNewScreen);
