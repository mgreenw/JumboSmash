// @ flow
import { Scene } from 'mobile/reducers';

const emojis = {
  smash: String.fromCodePoint(0x1f351),
  social: String.fromCodePoint(0x1f418),
  stone: String.fromCodePoint(0x1f343)
};

function sceneToEmoji(scene: Scene) {
  switch (scene) {
    case 'social': {
      return emojis.social;
    }

    case 'smash': {
      return emojis.smash;
    }

    case 'stone': {
      return emojis.stone;
    }

    default: {
      // eslint-disable-next-line no-unused-expressions
      (scene: empty); // ensures we have handled all cases
      return '';
    }
  }
}

export { emojis, sceneToEmoji };
