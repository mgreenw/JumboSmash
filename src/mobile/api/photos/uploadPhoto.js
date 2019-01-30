// @flow

import { apiRequest } from "../utils/apiRequest";
import { GET_SIGN_URL__ROUTE } from "../routes";
import type { SignedUrlPayload } from "mobile/api/photos/getSignedUrl";

function uploadPhotoToS3(
  uri: string,
  payload: SignedUrlPayload
): Promise<boolean> {
  let formdata = new FormData();
  formdata.append("Content-Type", "image/jpeg");
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
