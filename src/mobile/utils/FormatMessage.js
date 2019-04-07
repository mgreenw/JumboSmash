// @flow
import type { Scene } from 'mobile/reducers';
import type { SystemMessage } from 'mobile/api/serverTypes';
import { sceneToEmoji } from './emojis';
import capitalize from './Capitalize';

function systemMessageScene(systemMessage: SystemMessage): Scene {
  switch (systemMessage) {
    case 'MATCHED_SOCIAL': {
      return 'social';
    }

    case 'MATCHED_SMASH': {
      return 'smash';
    }

    case 'MATCHED_STONE': {
      return 'stone';
    }

    default: {
      // eslint-disable-next-line no-unused-expressions
      (systemMessage: empty); // ensures we have handled all cases

      // If we mess up and pass this a normal string somehow, just return that string.
      // This can happen if the server enum does not match the mobile enum.
      return systemMessage;
    }
  }
}

/**
 *
 * @param {string} message Message text to format. If a systemMessage, formats. Otherwise, returns the messsage.
 * @returns {string} The formated message
 */
function formatMessage(message: string): string {
  if (
    message !== 'MATCHED_SOCIAL' &&
    message !== 'MATCHED_SMASH' &&
    message !== 'MATCHED_STONE'
  ) {
    return message;
  }
  const scene = systemMessageScene(message);
  const emoji = sceneToEmoji(scene);
  const capitalizedScene = capitalize(scene);
  return `${emoji} You matched in Jumbo${capitalizedScene} ${emoji}`;
}

export default formatMessage;
