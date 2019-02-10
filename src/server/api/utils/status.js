// @flow

type ResponseStatus = {
  status: string,
  code: number,
};

export type DataResponse<T> = {
  statusCode: number,
  body: {
    status: string,
    data: T,
  },
};

export type NoDataResponse = {
  statusCode: number,
  body: {
    status: string,
  },
};


const status = (responseStatus: ResponseStatus) => {
  return {
    data: function data<T>(responseData: T): DataResponse<T> {
      return {
        statusCode: responseStatus.code,
        body: {
          status: responseStatus.status,
          data: responseData,
        },
      };
    },
    noData: (): NoDataResponse => {
      return {
        statusCode: responseStatus.code,
        body: {
          status: responseStatus.status,
        },
      };
    },
  };
};

module.exports = status;
