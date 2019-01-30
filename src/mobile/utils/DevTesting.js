// @flow

const LATENCY_MAX_MS = 3000;
const LATENCY_MIN_MS = 100;
export default {
  // If in dev mode, add a few seconds of latency to requests so that we can
  // ensure proper handling
  fakeLatency(func: () => void) {
    // $FlowFixMe (__DEV__ will break flow)
    if (__DEV__) {
      let latency = Math.floor(Math.random() * LATENCY_MAX_MS) + LATENCY_MIN_MS;
      setTimeout(func, latency);
    } else {
      func();
    }
  },

  log(...data: Array<any>) {
    // $FlowFixMe (__DEV__ will break flow)
    if (__DEV__) {
      console.log(...data);
    }
  }
};
