// @flow

type ResponseStatus = {
  status: string,
  code: number,
};

const status = (responseStatus: ResponseStatus) => {
  return {
    data: (data: any) => {
      return {
        statusCode: responseStatus.code,
        body: {
          status: responseStatus.status,
          data,
        },
      };
    },
  };
};

module.exports = status;
