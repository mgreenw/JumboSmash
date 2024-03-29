// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import { PrimaryButton } from 'mobile/components/shared/buttons';
import type { Scene, ReduxState, Dispatch } from 'mobile/reducers';
import { connect } from 'react-redux';
import { enableScene as enableSceneAction } from 'mobile/actions/app/saveSettings';
import { subYears, isAfter } from 'date-fns';
import { sceneToEmoji } from 'mobile/utils/emojis';
import capitalize from 'mobile/utils/Capitalize';

const SCENE_DESCRIPTIONS: { [scene: Scene]: string } = {
  smash: 'This is where you can match with people to get ~frisky~',
  social:
    'This is where you can match with people for hanging out - from study buddies to a night out on the town.',
  stone:
    'This is where you can match with people to get lit in the truest sense.'
};

type ProppyProps = {
  scene: Scene,
  dismissCard: () => void
};

type DispatchProps = {
  enableScene: () => void
};

type ReduxProps = {
  sceneEnabled: boolean,
  canBeActiveInScenes: boolean,
  enableSceneInProgress: boolean,
  is21: boolean
};

type Props = ProppyProps & DispatchProps & ReduxProps;

function mapStateToProps(reduxState: ReduxState, ownProps: Props): ReduxProps {
  const { scene } = ownProps;
  // Bluryface check
  const twentyOneYearsAgo = subYears(new Date(), 21);
  if (!reduxState.client) {
    throw new Error('Redux Client is null in Settings Edit');
  }
  const is21 = isAfter(
    twentyOneYearsAgo,
    new Date(reduxState.client.profile.fields.birthday)
  );
  if (!reduxState.client) {
    throw new Error('Redux Client is null in Settings Edit after date ');
  }
  return {
    sceneEnabled: reduxState.client.settings.activeScenes[scene],
    enableSceneInProgress: reduxState.inProgress.saveSettings,
    canBeActiveInScenes: reduxState.client.settings.canBeActiveInScenes,
    is21
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: Props
): DispatchProps {
  const { scene } = ownProps;
  return {
    enableScene: () => {
      dispatch(enableSceneAction(scene));
    }
  };
}

class InactiveSceneCard extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const { sceneEnabled, dismissCard } = this.props;
    if (sceneEnabled && !prevProps.sceneEnabled) {
      // TODO: figure out why this fails.
      // For now, the double press is fine.
      // dismissCard();
    }
  }

  render() {
    const {
      scene,
      enableScene,
      sceneEnabled,
      enableSceneInProgress,
      dismissCard,
      canBeActiveInScenes,
      is21
    } = this.props;
    const sceneName = `Jumbo${capitalize(scene)}`;
    const icon = sceneToEmoji(scene);
    const description = SCENE_DESCRIPTIONS[scene];

    const lockedAccountCopy =
      'Your account is currently locked. Please check your email for more information.';
    const not21Copy = 'You must be 21 years old to use this feature.';
    const normalInstructionsCopy = `You won’t be shown in ${sceneName} unless you enable it. You can always turn it off in settings.`;

    // eslint-disable
    const enableSceneInstructions = (() => {
      if (!canBeActiveInScenes) return lockedAccountCopy;
      if (scene === 'stone' && !is21) return not21Copy;
      return normalInstructionsCopy;
    })();

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: Colors.White,
          paddingHorizontal: '10%'
        }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={[textStyles.headline5Style, { textAlign: 'center' }]}>
            Welcome to
          </Text>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[
              textStyles.jumboSmashStyle,
              { fontSize: 40, padding: 15, textAlign: 'center' }
            ]}
          >
            {sceneName}
          </Text>
        </View>
        <View style={{ flex: 2 }}>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            {sceneEnabled && scene === 'stone' ? (
              <View>
                <Text
                  style={[textStyles.headline5StyleDemibold, { fontSize: 20 }]}
                >
                  {'By Swiping in Stone, you agree not to use JumboSmash to:'}
                </Text>
                <Text style={[textStyles.headline5Style, { fontSize: 20 }]}>
                  {'- buy, sell, or distribute marijuana'}
                </Text>
                <Text style={[textStyles.headline5Style, { fontSize: 20 }]}>
                  {'- use marijuana on the Tufts campus'}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: Colors.Grapefruit,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontSize: 69 }}>{icon}</Text>
              </View>
            )}
          </View>
          {sceneEnabled && scene === 'stone' ? null : (
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Text
                style={[textStyles.headline6Style, { textAlign: 'center' }]}
              >
                {description}
              </Text>
            </View>
          )}
        </View>
        <PrimaryButton
          onPress={sceneEnabled ? dismissCard : enableScene}
          title={sceneEnabled ? 'Start Swiping' : `Enable ${sceneName}`}
          loading={enableSceneInProgress}
          disabled={
            enableSceneInProgress ||
            !canBeActiveInScenes ||
            (scene === 'stone' && !is21)
          }
        />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          {!sceneEnabled && (
            <Text
              style={[
                textStyles.subtitle1Style,
                {
                  textAlign: 'center',
                  color: canBeActiveInScenes ? Colors.Black : Colors.Grapefruit
                }
              ]}
            >
              {enableSceneInstructions}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InactiveSceneCard);
