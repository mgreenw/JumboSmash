// TODO: flow type this

// middleware logger for actions
export function loggerMiddleware({ getState }) {
  return next => action => {
    console.log("Will Dispatch:", action.type);
    // Call the next dispatch method in the middleware chain.
    return next(action);
  };
}
