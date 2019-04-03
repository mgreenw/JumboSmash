// @flow
import type { Dispatch, ReadReceipt } from 'mobile/reducers';

export type ReadReceiptUpdateInitiated_Action = {
  type: 'READ_RECEIPT_UPDATE__INITIATED',
  payload: {},
  meta: {}
};

export type ReadReceiptUpdateCompleted_Action = {
  type: 'READ_RECEIPT_UPDATE__COMPLETED',
  payload: {
    readerUserId: number,
    readReceipt: ReadReceipt
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
  readReceipt: ReadReceipt
): ReadReceiptUpdateCompleted_Action {
  return {
    type: 'READ_RECEIPT_UPDATE__COMPLETED',
    payload: { readerUserId, readReceipt },
    meta: {}
  };
}

export default (readerUserId: number, readReceipt: ReadReceipt) => (
  dispatch: Dispatch
) => {
  dispatch(initiate());
  dispatch(complete(readerUserId, readReceipt));
};
