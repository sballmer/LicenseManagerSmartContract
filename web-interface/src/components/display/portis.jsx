import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Button, Typography, TextField,
  InputLabel, FormControl, Select, MenuItem,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export function PortisDisplay(props) {
  const {
    logged,
    network,
    balance,
    reputation,
    address,
    isLoggedIn,
    handleLogout,
    handleSubmit,
    showPortis,
    title,
  } = props;

  const classes = useStyles();
  const [wallet, setTextWallet] = useState(address);
  const [selection, setTextSelector] = useState(network);
  useEffect(() => { setTextWallet(address)}, [address] );
  useEffect(() => { setTextSelector(network)}, [network] );
  const inputSizes = { minWidth: '400px', maxWidth: '70vw' };

  return (
    <>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Grid item style={{ marginTop: '25px', marginBottom: '30px' }}>
          <Typography variant="h4" component="h1" style={{ maxWidth: '95vw',  overflowWrap: 'break-word' }}>
            {title || 'Zucchini Dapp'}
          </Typography>
        </Grid>
        <Grid item>
          <div>
          <Button
            variant="outlined"
            color="primary"
            style={{ margin: '3px', width: '160px' }}
            onClick={() => showPortis()}
          >
            Show Portis
          </Button>
          <Button
            variant="outlined"
            color="primary"
            style={{ margin: '3px', width: '140px' }}
            onClick={() => isLoggedIn()}
          >
            {`Logged ? ${logged ? '🔵' : '🔴'}`}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            style={{ margin: '3px'}}
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
          </div>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ margin: '6px' }}
      >
        {logged ? (
          <div style={{ margin: '15px' }}>
            <Grid style={{ display: 'flex', alignItems: 'center', minWidth: '180px' }}>
              <FormControl className={classes.formControl}>
                <InputLabel>Network</InputLabel>
                <Select
                  style={{ width: '250px' }}
                  value={selection}
                  onChange={(evt) => setTextSelector(evt.target.value)}
                >
                  <MenuItem key="ropsten" value="ropsten">Ethereum Test-net (Ropsten)</MenuItem>
                  <MenuItem key="binance-test" value="binance-test">Binance Test-net</MenuItem>
                  {/* <MenuItem key="mainnet" value="mainnet">Ethereum Main-net</MenuItem>
                  <MenuItem key="binance-main" value="binance-main">Binance Main-net</MenuItem> */}
                </Select>
              </FormControl>
              <Button
                disabled={!selection}
                variant="contained"
                color="primary"
                style={{ margin: '15px' }}
                onClick={(evt) => handleSubmit(evt, 'network', selection)}
              >
                Switch Network
              </Button>
            </Grid>
            <Grid item>
              <TextField
                label="Wallet address"
                defaultValue={wallet}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                style={{...inputSizes, marginTop: '2px' }}
                onChange={(evt) => setTextWallet(evt.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: '12px' }}
                onClick={(evt) => handleSubmit(evt, 'address', wallet)}
              >
                Change Wallet
              </Button>
            </Grid>
            <Grid item>
            {!Number.isNaN(balance)
                ? (
                  <TextField
                    label="Balance ETH"
                    value={balance}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    variant="filled"
                    style={inputSizes}
                  />
                )
                : null}
              {reputation
                ? (
                  <TextField
                    label="Reputation"
                    value={reputation}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    variant="filled"
                    style={inputSizes}
                  />
                )
              : null}
            </Grid>
          </div>
        ) : null}
      </Grid>
    </>
  )
}

export default PortisDisplay;