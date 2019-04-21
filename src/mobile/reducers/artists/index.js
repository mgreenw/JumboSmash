// @flow
import Search from './searchArtists';
import Get from './getArtist';
import type { SearchArtists_Action } from './searchArtists';
import type { GetArtist_Action } from './getArtist';

export type Artist_Action = SearchArtists_Action | GetArtist_Action;

export type inProgress = {|
  search: boolean,
  get: {
    [id: string]: boolean
  }
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
    search: false,
    get: {}
  }
};

const Reducers = {
  Search,
  Get
};

export { DefaultReduxState, Reducers };
