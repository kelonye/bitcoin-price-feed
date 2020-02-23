import { ACTION_TYPE_UPDATE_DATA } from 'config';
import { WEB3, PRICE_FEED_CONTRACT } from 'utils/wallet';
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
            value: WEB3.utils.toWei('0.001', 'ether'),
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
