import { createDfuseClient } from '@dfuse/client';
import { PRICE_FEED_CONTRACT } from 'contracts';

const { REACT_APP_DFUSE_API_KEY } = process.env;

const client = createDfuseClient({
  apiKey: REACT_APP_DFUSE_API_KEY,
  network: 'mainnet.eth.dfuse.io',
});

export async function trackTransaction(transactionId) {
  console.log('dfuse: tracking %s', transactionId);

  const streamEthTransfers = `subscription () {
    searchTransactions(indexName: CALLS, query: "to:${PRICE_FEED_CONTRACT.address}",  sort: ASC, cursor: "") {
      cursor
      node { hash from to value }
    }
  }`;

  const stream = await client.graphql(
    streamEthTransfers,
    message => {
      if (message.type === 'error') {
        console.log(
          'dfuse: an error occurred',
          message.errors,
          message.terminal
        );
      }

      if (message.type === 'data') {
        const { cursor, node } = message.data.searchTransactions;
        console.log('dfuse: message %s %s', node.hash, transactionId);
        if (node.hash === transactionId) {
          stream.close();
        } else {
          stream.mark({ cursor });
        }
      }
    },
    {
      variables: {},
    }
  );

  await stream.join();

  console.log('dfuse: complete');
}
