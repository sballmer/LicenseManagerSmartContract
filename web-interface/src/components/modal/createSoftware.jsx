import React, { useState } from "react"
import {
  Grid, Button, Typography, TextField,
} from '@material-ui/core';

export function SoftwareForm({
  createSoftware,
  closeFunction,
}) {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  // const [date, setDate] = useState(0);

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
          Software creation
        </Typography>
      </Grid>
      <Grid style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Software name"
          defaultValue={name}
          variant="outlined"
          onChange={(evt) => setName(evt.target.value)}
          style={inputSizes}
        />
      </Grid>
      <Grid style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
        <TextField
          label="Version label"
          defaultValue={version}
          variant="outlined"
          onChange={(evt) => setVersion(evt.target.value)}
          style={inputSizes}
        />
      </Grid>
      {/* <Grid style={{ display: 'flex', alignItems: 'center', marginTop: '15px', marginBottom: '30px' }}>
        <TextField
          label={date ? "Expiry date" : ""}
          type="datetime-local"
          defaultValue={date ? date.toISOString().split('.')[0] : 0}
          onChange={(evt) => setDate(new Date(evt.target.value))}
          variant="outlined"
        />
      </Grid> */}
      <Grid item>
        <Button
          disabled={!name || !version}
          variant="contained"
          color="primary"
          style={{ marginBottom: '15px' }}
          onClick={() => {
            if (window.confirm('Do you want to create a new software ?')) {
              createSoftware({ date: 0, name, version });
              closeFunction();
            }
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

export default SoftwareForm;
