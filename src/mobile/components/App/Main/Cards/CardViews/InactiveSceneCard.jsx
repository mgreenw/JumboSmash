// @flow

import React from 'react';
import { Text, View, Alert } from 'react-native';
import { Colors } from 'mobile/styles/colors';
import { textStyles } from 'mobile/styles/textStyles';
import { PrimaryButton } from 'mobile/components/shared/buttons/PrimaryButton';
import type { Scene, ReduxState, Dispatch } from 'mobile/reducers';
import { connect } from 'react-redux';
import { enableScene as enableSceneAction } from 'mobile/actions/app/saveSettings';

const SCENE_META_DATA = {
  smash: {
    display: 'JumboSmash',
    icon: '🍑',
    description: 'This is where you can match with people to get ~frisky~'
  },
  social: {
    display: 'JumboSocial',
    icon: '🐘',
    description:
      'This is where you can match with people for hanging out - from study buddies to a night out on the town.'
  },
  stone: {
    display: 'JumboStone',
    icon: '🍀',
    description:
      'This is where you can match with people to get blazed out of your mind'
  }
};

type ProppyProps = {
  scene: Scene
};

type DispatchProps = {
  enableScene: () => void
};

type ReduxProps = {
  sceneEnabled: boolean
};

type Props = ProppyProps & DispatchProps & ReduxProps;

function mapStateToProps(reduxState: ReduxState, ownProps: Props): ReduxProps {
  const { scene } = ownProps;
  if (!reduxState.client) {
    throw new Error('client is null in Cards Screen');
  }
  return {
    sceneEnabled: reduxState.client.settings.activeScenes[scene]
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

const inactiveSceneCard = (props: Props) => {
  const { scene, enableScene } = props;
  const sceneData = SCENE_META_DATA[scene];

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.White
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[textStyles.headline5Style, { textAlign: 'center' }]}>
          Welcome to
        </Text>
        <Text
          style={[
            textStyles.jumboSmashStyle,
            { fontSize: 40, padding: 15, textAlign: 'center' }
          ]}
        >
          {sceneData.display}
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
          <Text style={{ fontSize: 69 }}>{sceneData.icon}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Text style={[textStyles.headline6Style, { textAlign: 'center' }]}>
          {sceneData.description}
        </Text>
      </View>
      <PrimaryButton
        onPress={enableScene}
        title={`Enable ${sceneData.display}`}
        loading={false}
        disabled={false}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[textStyles.subtitle1Style, { textAlign: 'center' }]}>
          {`You won’t be shown in ${sceneData.display}
unless you turn it on in Settings.`}
        </Text>
      </View>
    </View>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(inactiveSceneCard);
