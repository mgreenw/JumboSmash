// @flow

const defaultState = {
  userName: 'jjaffe01',
}

export default function rootReducer(state=defaultState, action) {
  switch(action) {
    default: {
      return state
    }
  }
}
