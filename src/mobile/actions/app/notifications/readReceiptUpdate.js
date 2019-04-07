// @flow
import type { Dispatch } from 'mobile/reducers';
import type { ServerReadReceipt } from 'mobile/api/serverTypes';

export type ReadReceiptUpdateInitiated_Action = {
  type: 'READ_RECEIPT_UPDATE__INITIATED',
  payload: {},
  meta: {}
};

export type ReadReceiptUpdateCompleted_Action = {
  type: 'READ_RECEIPT_UPDATE__COMPLETED',
  payload: {
    readerUserId: number,
    readReceipt: ?ServerReadReceipt
  },
  meta: {}
};

function initiate(): ReadReceiptUpdateInitiated_Action {
  return {
    type: 'READ_RECEIPT_UPDATE__INITIATED',
    payload: {},
    meta: {}
  };
}

function complete(
  readerUserId: number,
  readReceipt: ?ServerReadReceipt
): ReadReceiptUpdateCompleted_Action {
  return {
    type: 'READ_RECEIPT_UPDATE__COMPLETED',
    payload: { readerUserId, readReceipt },
    meta: {}
  };
}

export default (readerUserId: number, readReceipt: ?ServerReadReceipt) => (
  dispatch: Dispatch
) => {
  dispatch(initiate());
  dispatch(complete(readerUserId, readReceipt));
};
