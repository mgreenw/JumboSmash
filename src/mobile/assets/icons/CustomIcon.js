// @flow

import { createIconSetFromFontello } from '@expo/vector-icons';
import fontelloConfig from './config.json';

export default createIconSetFromFontello(fontelloConfig, 'gemicons');

// add more from fontello as needed. See "demo.html" of the fontello
// config if you need to figure out the names.
export type IconName =
  | 'add'
  | 'back'
  | 'cards'
  | 'check'
  | 'delete-filled'
  | 'heart-filled'
  | 'life-ring'
  | 'message'
  | 'send'
  | 'user'
  | 'gear'
  | 'ellipsis'
  | 'info-circled'
  | 'down'
  | 'forward'
  | 'help-circled'
  | 'attention-circled'
  | 'attention'
  | 'attach'
  | 'down-open'
  | 'up-open'
  | 'cw'
  | 'filter'
  | 'menu'
  | 'trash'
  | 'user-secret';
