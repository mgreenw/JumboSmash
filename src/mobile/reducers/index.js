// @flow

const defaultState = {
  userName: 'jjaffe01',
  checkingAuth: true,
  loggedIn: false,
}

export default function rootReducer(state=defaultState, action) {
  switch(action) {
    default: {
      return state
    }
  }
}
