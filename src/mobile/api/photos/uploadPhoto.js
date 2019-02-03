// @flow

import { apiRequest } from "../utils/apiRequest";
import { GET_SIGN_URL__ROUTE } from "../routes";
import type { SignedUrlPayload } from "mobile/api/photos/getSignedUrl";

// Uploads a photo to S3 via the signed photo payload we recieve from
// the get-signed-url endpoint.
// AWS has VERY specific orders thing need to be in.
function uploadPhotoToS3(
  uri: string,
  payload: SignedUrlPayload
): Promise<boolean> {
  let formdata = new FormData();
  formdata.append("Content-Type", "image/jpeg"); // MUST be first
  for (let f in payload.fields) {
    const field = f;
    formdata.append(field, payload.fields[field]);
  }
  formdata.append(
    "file",
    ({
      uri,
      type: `image/jpeg`
    }: any) // TODO: properly import the types
  );
  return fetch(payload.url, {
    method: "POST",
    body: formdata,
    headers: {
      "Content-Type": "image/jpeg"
    }
  })
    .then(response => {
      return response.status === 204;
    })
    .catch(err => {
      return false;
    });
}

export { uploadPhotoToS3 };
