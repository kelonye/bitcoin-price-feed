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
}) {
  const classes = useStyles();

  return (
    <div className={clsx('flex flex--justify-center', classes.container)}>
      <Paper
        className={clsx(classes.paper, {
          [classes.paperInactive]: isTrackingTransaction,
        })}
      >
        {!account ? (
          <Button
            variant="contained"
            onClick={activateWallet}
            disabled={!window.ethereum}
            fullWidth
            color="secondary"
          >
            CONNECT TO METAMASK
          </Button>
        ) : (
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
        )}
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
  ({ data, wallet: { isTrackingTransaction, account } }) => ({
    ...data,
    isTrackingTransaction,
    account,
  }),
  mapDispatchToProps
)(Component);
