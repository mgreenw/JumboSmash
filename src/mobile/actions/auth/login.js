// @flow
import type { Dispatch } from 'redux';

// saves a user's login token to the redux store
// assumes the token is valid.
export const LOGIN_WITH_NEW_TOKEN = 'LOGIN_WITH_NEW_TOKEN';
export const login = (utln: string, token: string) => ({
  type: LOGIN_WITH_NEW_TOKEN,
  utln: utln,
  token: token,
});


//
// export const login = (token: string) => {
//   return async (dispatch: Dispatch) => {
//     // First, let Redux know we've begun an action.
//     dispatch(initiate__SendVerificationEmail());
//
//     // Temporary timeout to ensure we our setting our state for loading icon
//     setTimeout(
//       () => {
//         timeout(1000,
//           // Send a request to the server to check if UTLN is valid. If it is, send
//           // a verification email, and return that email address.
//           fetch('http://127.0.0.1:3000/api/auth/send-verification-email/', {
//             method: 'POST',
//             headers: {
//               Accept: 'application/json',
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               utln: utln,
//             }),
//           })
//         )
//         .then(response => response.json())
//         .then((response) => {
//           resolve__SendVerificationEmail(response.statusCode, response)
//         });
//       },
//       2000
//     );
//
//     // TODO: create a standardized set of front-end routes
//
//
//     // .catch(
//     //   (error) => {
//     //     if (error == TIMEOUT) {
//     //       dispatch(failSendVerificationEmail(TIMEOUT))
//     //     } else {
//     //       console.log("Uncaught error");
//     //       // TODO: create a catch for 'TypeError: Network request failed',
//     //       // maybe as a middleware, on the timeout function itself, as a more
//     //       // specific one for wrapping these requests.
//     //       dispatch(failSendVerificationEmail(error))
//     //     }
//     //   }
//     // );
//   }
// };
