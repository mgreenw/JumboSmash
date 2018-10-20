// @flow

// I took this from  https://stackoverflow.com/questions/42147733/doing-a-timeout-error-with-fetch-react-native
// Why do we care about this?
// React-Native doesn't really have a way to timeout network requests. Isntead,
// we let them silently complete in the background, and throw away any results.
//

import { TIMEOUT } from '../errorResponseCodes'

// TODO: test this!
export function timeout(ms: number, promise: Promise<Response>): Promise<Response> {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error(TIMEOUT))
    }, ms)
    promise.then(resolve, reject)
  })
}
