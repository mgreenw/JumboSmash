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
import { PrimaryButton } from 'mobile/components/shared/buttons';

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};
type DispatchProps = {
  postYak: (content: string) => void
};
type ReduxProps = {
  postInProgress: boolean
};
type Props = ReduxProps & DispatchProps & NavigationProps;

type State = {
  content: string
};

function mapStateToProps(reduxState: ReduxState): ReduxProps {
  return {
    postInProgress: reduxState.yaks.inProgress.post
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
      content: ''
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { postInProgress } = this.props;
    // TODO: consider error handling -- if post fails this still goes back!
    if (!postInProgress && prevProps.postInProgress) {
      this._onBack();
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

  render() {
    const { postInProgress } = this.props;
    const { content } = this.state;
    const loading = postInProgress;

    const TitleComponent = (
      <Text style={textStyles.headline5Style}>
        {'New Jumbo'}
        <Text style={textStyles.headline5StyleDemibold}>{'Yak'}</Text>
      </Text>
    );

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
                paddingHorizontal: '10.1%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'top'
              }}
            >
              <Text
                style={[textStyles.headline5Style, { paddingVertical: '5.1%' }]}
              >
                {`GIVE US CONTENT`}
              </Text>
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
                    placeholder="YAK YAK YAK"
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
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YakNewScreen);
