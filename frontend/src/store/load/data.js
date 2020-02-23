import PRICE_FEED_CONTRACT_JSON from 'data/contracts/PriceFeed';
import { WEB3, WRITES_ENABLED } from 'utils/wallet';
import { PRICE_FEED_CONTRACT } from 'contracts';

export default Base =>
  class extends Base {
    async loadData() {
      try {
        let networkId = 1;
        let networkName = 'main';

        if (WRITES_ENABLED) {
          networkId = await window.WEB3.eth.net.getId();
          networkName = await window.WEB3.eth.net.getNetworkType();
        }

        this.state.wallet.networkId = networkId;
        this.state.wallet.networkName = networkName;

        const networkSupported = (this.state.wallet.networkSupported =
          networkId in PRICE_FEED_CONTRACT_JSON.networks);

        if (networkSupported) {
          PRICE_FEED_CONTRACT.setNetworkId(networkId);
          PRICE_FEED_CONTRACT.setContract(PRICE_FEED_CONTRACT_JSON);

          this.state.data.price = await PRICE_FEED_CONTRACT.read(
            'bitcoinPrice'
          );
          this.state.data.lastRequestId = await PRICE_FEED_CONTRACT.read(
            'lastRequestId'
          );
          this.state.data.pending = await PRICE_FEED_CONTRACT.read('pending');
          this.state.wallet.account = (await WEB3.eth.getAccounts())[0];
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
