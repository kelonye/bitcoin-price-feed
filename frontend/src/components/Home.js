import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Paper, Chip, Button } from '@material-ui/core';
import Loader from './Loader';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
  },
  paper: { marginTop: 50, padding: 50, width: 600 },
  paperInactive: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  buttonsContainer: { marginTop: 20 },
  loader: {
    position: 'absolute',
    top: '50%',
  },
}));

function Component({
  isTrackingTransaction,
  price,
  pending,
  lastRequestId,
  requestUpdate,
  completeUpdate,
  account,
  activateWallet,
  networkName,
  networkSupported,
  updateWallet,
}) {
  const classes = useStyles();

  React.useEffect(() => {
    // if (PRICE_FEED_CONTRACT.contract) {
    // PRICE_FEED_CONTRACT.on('priceUpdated', function(err, result) {
    //   if (err) {
    //     return console.error(err);
    //   }
    //   store.dispatch(updateData({ price: parseInt(result.returnValues.count) }));
    // });
    // }

    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        document.location.reload();
      });

      window.ethereum.on('accountsChanged', function(accounts) {
        updateWallet({ account: accounts[0] });
      });
    }
  }, [updateWallet]);

  let pane;

  if (!networkSupported) {
    pane = (
      <div className="flex flex--column flex--justify-center flex--align-center">
        Unsuported network: {networkName}
      </div>
    );
  } else if (!account) {
    pane = (
      <Button
        variant="contained"
        onClick={activateWallet}
        disabled={!window.ethereum}
        fullWidth
        color="secondary"
      >
        CONNECT TO METAMASK
      </Button>
    );
  } else {
    pane = (
      <React.Fragment>
        <div className="flex flex--column flex--justify-center flex--align-center">
          <Chip label={price} />
          <div>Pending: {`${pending}`}</div>
          <div>LastRequestId: {lastRequestId}</div>
        </div>

        <div
          className={clsx(
            classes.buttonsContainer,
            'flex flex--justify-center'
          )}
        >
          <Button
            variant="contained"
            onClick={requestUpdate}
            fullWidth
            color="secondary"
          >
            REQUEST UPDATE
          </Button>
          &nbsp;
          <Button
            variant="contained"
            onClick={completeUpdate}
            fullWidth
            color="secondary"
          >
            COMPLETE UPDATE
          </Button>
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className={clsx('flex flex--justify-center', classes.container)}>
      <Paper
        className={clsx(classes.paper, {
          [classes.paperInactive]: isTrackingTransaction,
        })}
      >
        {pane}
      </Paper>

      {!isTrackingTransaction ? null : (
        <div className={classes.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
}

export default connect(
  ({
    data,
    wallet: { isTrackingTransaction, account, networkName, networkSupported },
  }) => ({
    ...data,
    isTrackingTransaction,
    account,
    networkName,
    networkSupported,
  }),
  mapDispatchToProps
)(Component);
