import { ACTION_TYPE_UPDATE_DATA } from 'config';
import Web3 from 'web3';
import { PRICE_FEED_CONTRACT } from 'contracts';
import { trackTransaction } from './wallet';

export function updateData(payload) {
  return {
    type: ACTION_TYPE_UPDATE_DATA,
    payload,
  };
}

export function requestUpdate() {
  return async(dispatch, getState) => {
    try {
      await dispatch(
        trackTransaction(
          await PRICE_FEED_CONTRACT.write('requestUpdate', [], {
            value: Web3.utils.toWei('0.001', 'ether'),
          })
        )
      );
    } catch (e) {
      console.warn(e);
    }
  };
}

export function completeUpdate() {
  return async(dispatch, getState) => {
    try {
      await dispatch(
        trackTransaction(await PRICE_FEED_CONTRACT.write('completeUpdate', []))
      );
    } catch (e) {
      console.warn(e);
    }
  };
}
