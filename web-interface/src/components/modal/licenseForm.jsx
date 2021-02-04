import React, { useState, useEffect } from "react"
import { Grid, Button, Typography, TextField, FormControlLabel, Checkbox } from '@material-ui/core';


export function LicenseForm({
  license,
  modifyLicense,
  sellFunction,
  changeOwner,
  changeExpiryDate,
  closeFunction,
}) {
  const {
    name='',
    version='',
    expiration_timestamp,
    selling_price_ETH,
    license_address,
    license_for_sale,
    software_address_linked,
    owner,
    // admin,
    // selling_price_wei,
  } = license;

  
    const [isForSale, setForSale] = useState(!!license_for_sale);
    const [price, setPrice] = useState(parseFloat(selling_price_ETH));
    const [currentOwner, setOwner] = useState(owner);
    const [date, setDate] = useState(expiration_timestamp && expiration_timestamp !== '0' ? new Date(expiration_timestamp) : null);
    useEffect(() => { setForSale(isForSale)}, [isForSale] );
    useEffect(() => { setPrice(price)}, [price] );
    useEffect(() => { setOwner(currentOwner)}, [currentOwner] );
    useEffect(() => { setDate(date)}, [date] );

    const inputSizes = { minWidth: '400px', maxWidth: '70vw' };
    return (
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Grid item style={{ marginTop: '25px', marginBottom: '30px' }}>
          <Typography variant="h5" component="h1" style={{ maxWidth: '95vw',  overflowWrap: 'break-word' }}>
            {`Details license of: ${name}`}
          </Typography>
        </Grid>
        {version ? (
          <Grid item>
            <TextField
              id="filled-read-only-input"
              label="Version"
              defaultValue={version}
              InputProps={{ readOnly: true }}
              type="text"
              variant="filled"
            />
          </Grid>
        ) : null}
        <Grid item>
          <TextField
            id="filled-read-only-input"
            label="Software address"
            defaultValue={software_address_linked}
            InputProps={{ readOnly: true }}
            variant="filled"
            style={inputSizes}
          />
        </Grid>
        <Grid item>
          <TextField
            id="filled-read-only-input"
            label="License address"
            defaultValue={license_address}
            InputProps={{ readOnly: true }}
            variant="filled"
            style={inputSizes}
          />
        </Grid>
        <Grid item style={{ margin: '0px' }}>
          <FormControlLabel
            label="Is for sale "
            control={
              <Checkbox
                checked={isForSale}
                onChange={(evt) => setForSale(evt.target.checked)}
                color="primary"
              />
            }
          />
        </Grid>
        <Grid style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <TextField
              disabled={!isForSale}
              InputProps={{ readOnly: !isForSale }}
              id="standard-number"
              label="Price ETH"
              type="number"
              step="0.0001"
              variant={isForSale ? "outlined" : "filled"}
              onChange={(evt) => setPrice(evt.target.value)}
            />
          </div>
          <div>
            <Button
              disabled={!isForSale || !price || parseFloat(price) < 0.0001}
              variant="contained"
              color="primary"
              style={{ marginLeft: '15px' }}
              onClick={() => {
                if (window.confirm('Do you want to set this license for sale ?')) sellFunction({ license, priceETH: price })
              }}
            >
              Sell at price
            </Button>
          </div>
        </Grid>
        <Grid style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
          <div>
            <TextField
              label="Owner address"
              defaultValue={currentOwner}
              variant="outlined"
              style={inputSizes}
              onChange={(evt) => setOwner(evt.target.value)}
            />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: '15px' }}
              onClick={(evt) => {
                if (window.confirm('Do you want to give license to this owner ?'))
                  changeOwner({ license, newOwner: currentOwner })
              }}
            >
              Change owner
            </Button>
          </div>
        </Grid>
        <Grid style={{ display: 'flex', alignItems: 'center', marginTop: '15px', marginBottom: '30px' }}>
          <div>
            <TextField
              disabled
              label={date ? "Expiry date" : ""}
              type="datetime-local"
              defaultValue={date ? date.toISOString().split('.')[0] : 0}
              onChange={(evt) => setDate(new Date(evt.target.value))}
              variant="outlined"
            />
          </div>
          <div>
            <Button
              disabled
              variant="contained"
              color="primary"
              style={{ marginLeft: '15px' }}
              onClick={(evt) => changeExpiryDate({ license, newDate: date ? date.toISOString().split('.')[0] : 0 })}
            >
              Set expiry date
            </Button>
          </div>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            style={{ marginBottom: '15px' }}
            onClick={closeFunction}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    );
}

export default LicenseForm;