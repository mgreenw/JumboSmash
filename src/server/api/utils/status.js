// @flow

const status = (statusCode: number) => {
  return {
    json: (body: Object) => {
      return {
        status: statusCode,
        body,
      };
    },
  };
};

module.exports = status;
