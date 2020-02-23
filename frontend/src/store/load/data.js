import { PRICE_FEED_CONTRACT, WEB3 } from 'utils/wallet';

export default Base =>
  class extends Base {
    async loadData() {
      try {
        await PRICE_FEED_CONTRACT.isReady();
        this.state.data.price = await PRICE_FEED_CONTRACT.read('bitcoinPrice');
        this.state.data.lastRequestId = await PRICE_FEED_CONTRACT.read(
          'lastRequestId'
        );
        this.state.data.pending = await PRICE_FEED_CONTRACT.read('pending');
        this.state.wallet.account = (await WEB3.eth.getAccounts())[0];
      } catch (error) {
        console.log(error);
      }
    }
  };
