
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, CardContent, Button, Typography }  from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    width: 270,
    maxWidth: 320,
    margin: '6px',
  },
  pos: {
    marginBottom: 12,
  },
  price: {
    fontSize: 'larger',
    textDecorationLine: 'underline',
    marginBottom: 12,
  },
});


const Kanban = ({
  title,
  wallet,
  address,
  date,
  dateLabel='',
  price,
  xrate,
  total,
  totalLabel='',
  version,
  forSale,
  openKanban,
  actionRemove,
  buttonLabel,
  admin,
  disableButton,
}) => {
  const classes = useStyles();
  let displayDate = null;
  if (date && date !== '0') displayDate = new Date(date).toISOString().split('.')[0].split('T');

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        {address ? (
          <Typography className={classes.pos} color="textSecondary" style={{ overflowWrap: "break-word" }}>
            Address: {address}
          </Typography>
        ) : null}
        {version ? (
          <Typography variant="body1" component="p" style={{ marginBottom: '5px' }}>
            {`version: ${version}`}
          </Typography>
        ) : null}
        {date ? (
          <Typography variant="body2" component="p">
            {`${dateLabel}${displayDate || ': Never'}`}
          </Typography>
        ) : null}
        {total ? (
          <Typography variant="body2" component="p">
            {`${totalLabel}${total}`}
          </Typography>
        ) : null}
        {/* {owner ? (
          <Typography className={classes.pos} color="textSecondary" style={{ overflowWrap: "break-word" }}>
            Owner: {owner}
          </Typography>
        ) : null} */}
        {forSale !== undefined ? (
          <Typography variant="body1" component="p">
            Is for sale ? {forSale ? 'Yes 🔴' : 'No 🔵'}
          </Typography>
        ) : null}
        {typeof admin === 'string' && typeof wallet === 'string' 
          && admin.toUpperCase() === wallet.toUpperCase() ? (
          <Typography className={classes.pos} color="textSecondary">
            {`Admin 👍`}
          </Typography>
        ) : null}
        {price ? (
          <Typography className={classes.price}>
            {`Price: ${xrate ? parseFloat(parseFloat(price) * xrate).toFixed(2) : price} ${xrate ? '$' : 'ETH'}`}
          </Typography>
        ) : null}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="outlined"
          disabled={disableButton}
          onClick={openKanban}>{buttonLabel || 'View more'}
        </Button>
        {actionRemove && admin.toUpperCase() === wallet.toUpperCase() ? (
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={actionRemove}
            startIcon={<DeleteIcon />}
          >
            Destroy
          </Button>
        ) : null}
      </CardActions>
    </Card>
  );
}


export default Kanban;
