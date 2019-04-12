// @flow

// REAL USE OF ESLINT DISABLE. THIS FILE IS WACK FOR REASONS BELOW.
/* eslint-disable */

import type { SignedUrlPayload } from 'mobile/api/photos/getSignedUrl';
import Sentry from 'sentry-expo';

// Uploads a photo to S3 via the signed photo payload we recieve from
// the get-signed-url endpoint.
// AWS has VERY specific orders thing need to be in.
export default function uploadPhotoToS3(
  uri: string,
  payload: SignedUrlPayload
): Promise<boolean> {
  const formdata = new FormData();
  formdata.append('Content-Type', 'image/jpeg'); // MUST be first
  for (const f in payload.fields) {
    const field = f;
    formdata.append(field, payload.fields[field]);
  }
  formdata.append(
    'file',
    ({
      uri,
      type: 'image/jpeg'
    }: any) // TODO: properly import the types
  );
  return fetch(payload.url, {
    method: 'POST',
    body: formdata
  })
    .then(response => response.status === 204)
    .catch(err => {
      Sentry.captureException(JSON.stringify(err));
      return false;
    });
}
