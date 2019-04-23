// @flow
import Search from './searchArtists';
import type { SearchArtists_Action } from './searchArtists';

export type Artist_Action = SearchArtists_Action;

export type inProgress = {|
  search: boolean
|};

export type ArtistImage = {|
  height: number,
  width: number,
  url: string
|};

export type Artist = {|
  id: string,
  images: ArtistImage[],
  name: string,
  type: 'artist'
|};

export type ReduxState = {|
  byId: { [id: string]: Artist },
  searchResultIds: string[],
  inProgress: inProgress
|};

const DefaultReduxState: ReduxState = {
  byId: {},
  searchResultIds: [],
  inProgress: {
    search: false
  }
};

const Reducers = {
  Search
};

export { DefaultReduxState, Reducers };
