// @flow
import { timeout } from "./timeout";
import DevTesting from "mobile/utils/DevTesting";

type method = "PATCH" | "GET" | "POST";
export function apiRequest(
  method: method,
  route: string,
  auth: ?string,
  request: ?Object
  // TODO: find a better way to type these promises
): Promise<Object> {
  return timeout(
    30000,
    fetch(route, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: auth || "NO_TOKEN"
      },
      body: request && JSON.stringify(request)
    })
  )
    .then(response => response.json())
    .catch(error => {
      console.log("Error caught in apiRequest.js: ", error);
      throw (error, request);
    });
}
