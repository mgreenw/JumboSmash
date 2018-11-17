// @flow

const LATENCY_MS = 100;
export default {
  // If in dev mode, add a few seconds of latency to requests so that we can
  // ensure proper handling
  fakeLatency(func: () => void) {
    // $FlowFixMe (__DEV__ will break flow)
    if (__DEV__) {
      setTimeout(func, LATENCY_MS);
    } else {
      func();
    }
  }
};
