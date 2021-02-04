import React, { useState } from "react"
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

export function LicenseForm({
  softwares,
  createLicense,
  closeFunction,
}) {
  const classes = useStyles();
  // const [isForSale, setForSale] = useState(false);
  // const [price, setPrice] = useState(parseFloat(0));
  const [date, setDate] = useState(0);
  const [software, setSoftware] = useState('');

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
          License creation
        </Typography>
      </Grid>
      <Grid style={{ display: 'flex', alignItems: 'center' }}>
        <FormControl className={classes.formControl}>
          <InputLabel>From software</InputLabel>
          <Select
            style={{ width: '250px' }}
            value={software}
            onChange={(evt) => setSoftware(evt.target.value)}
          >
            {softwares && softwares.length ? (
              softwares.map((sw, id) => (<MenuItem key={id} value={sw}>{sw.name}</MenuItem>))
            ) : null}
          </Select>
        </FormControl>
      </Grid>
      {/* <Grid item style={{ margin: '0px' }}>
        <FormControlLabel
          label="Set for sale ?"
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
      </Grid> */}
      <Grid style={{ display: 'flex', alignItems: 'center', marginTop: '15px', marginBottom: '30px' }}>
          <TextField
            label="Expiry date"
            InputLabelProps={{
              shrink: true,
            }}
            type="datetime-local"
            defaultValue={date ? date.toISOString().split('.')[0] : 0}
            onChange={(evt) => setDate(new Date(evt.target.value))}
            variant="outlined"
          />
      </Grid>
      <Grid item>
        <Button
          disabled={!software}
          variant="contained"
          color="primary"
          style={{ marginBottom: '15px' }}
          onClick={() => {
            if (window.confirm(`Do you want to create a new license of this software: ${software.name} ?`))
              createLicense({ price: 0, date: date ? parseInt(new Date(date).getTime()/1000) : 0, software })
          }}
        >
          Create
        </Button>
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
