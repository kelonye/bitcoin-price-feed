import PriceFeed from 'data/contracts/PriceFeed';
import Promise from 'bluebird';
import Web3 from 'web3';
import store from 'store';
import { updateData, updateWallet } from 'actions';

const CONTRACTS_JSON = {
  PriceFeed,
};

export const WEB3 = new Web3(
  typeof window.web3 !== 'undefined'
    ? window.web3.currentProvider
    : new Web3.providers.HttpProvider(
        'https://mainnet.infura.io/v3/90b4177113144a0c82b2b64bc01950e1'
      )
);
window.WEB3 = WEB3;

export class Contract {
  constructor(contractType) {
    this.setContractPromise = this.setContract(contractType);
  }

  async isReady() {
    await this.setContractPromise;
    return !!this.contract;
  }

  async setContract(contractType) {
    const networkId = await WEB3.eth.net.getId();
    console.log('network id', networkId);
    const json = CONTRACTS_JSON[contractType];
    const network = json.networks[networkId];
    if (network) {
      this.address = network.address;
      this.contract = new WEB3.eth.Contract(json.abi, this.address);
    }
  }

  async read(method, args = []) {
    return this.callContract(false, method, args);
  }

  async write(method, args = [], options = {}) {
    return this.callContract(true, method, args, options);
  }

  async callContract(write, method, args, options) {
    if (!(await this.isReady())) {
      return;
    }
    return new Promise((resolve, reject) => {
      const writeOpts = {};
      if (write) {
        const {
          wallet: { account },
        } = store.getState();
        writeOpts.from = account;
        for (const k in options) {
          writeOpts[k] = options[k];
        }
      }
      this.contract.methods[method](...args)[write ? 'send' : 'call'](
        ...(write ? [writeOpts] : []),
        (err, response) => {
          if (err) return reject(new Error(err.message));
          resolve(response.c?.[0] ?? response);
        }
      );
    });
  }

  async on(eventName, fn) {
    if (!(await this.isReady())) {
      return;
    }
    this.contract.events[eventName]({}, fn);
  }
}

if (window.ethereum) {
  window.ethereum.on('chainChanged', () => {
    document.location.reload();
  });

  window.ethereum.on('accountsChanged', function(accounts) {
    store.dispatch(updateWallet({ account: accounts[0] }));
  });
}

export const PRICE_FEED_CONTRACT = new Contract('PriceFeed');

PRICE_FEED_CONTRACT.on('priceUpdated', function(err, result) {
  if (err) {
    return console.error(err);
  }
  store.dispatch(updateData({ price: parseInt(result.returnValues.count) }));
});
