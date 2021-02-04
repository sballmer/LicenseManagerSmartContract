import React from "react"
import { Button, Grid, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import withPortisProvider from './provider/portis';
import TabStateProvider from './tabHandler';
import PortisDisplay from './display/portis';
import Drawer from './display/drawer';
import { LoaderBar } from './display/loader';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.onDrawerClose = this.onDrawerClose.bind(this);

    this.state = {
      drawerOpen: false,
    }
  }

  openDrawer() {
    const { portis } = this.props;
    portis.showPortis()
    this.setState({ drawerOpen: true });
  }

  onDrawerClose() {
    this.setState({ drawerOpen: false });
  }

  render() { // display tabs buttons
    const { drawerOpen } = this.state;
    const {
      portis, web3, logged, email, address, network, reputation, balance,
      getBalance, handleSubmit, handleLogout, isLoggedIn,
      primColor, primLight,
    } = this.props;

    return (
      <div>
        <Grid container justify="center">
          <Grid item>
            <Button
              variant="contained"
              size="large"
              style={{ width: '350px', margin: '5px', alignSelf: 'center' }}
              onClick={() => this.openDrawer()}
              startIcon={<MenuIcon/>}
            >
              {email || 'Portis'}
            </Button>
          </Grid>
        </Grid>
        <Grid container justify="center">
          {logged && web3 ? (
            <TabStateProvider {...this.props} />
          ) : (
            <Grid item style={{ marginTop: '30px', width: '80vw' }}>
              <LoaderBar />
              <Typography variant="h6" component="h1">
                Please wait or log in to Portis
              </Typography>
            </Grid>
          )}
        </Grid>
        <Drawer isOpen={drawerOpen} onClose={this.onDrawerClose} >
          {portis ? (
            <PortisDisplay
              email={email}
              network={network}
              address={address}
              logged={logged}
              balance={balance}
              reputation={reputation}
              getBalance={getBalance}
              handleSubmit={handleSubmit}
              handleLogout={handleLogout}
              isLoggedIn={isLoggedIn}
              showPortis={() => portis.showPortis()}
              title="Portis"
              mainBgColor={primColor}
              bgColor={primLight}
            />
          ) : (
            <>
              <Typography variant="h6" component="h1">
                Portis
              </Typography>
              <Typography variant="body1" component="h4">
                Could not load module... Please relaod page
              </Typography>
            </>
          )}
        </Drawer>
      </div>
    );
  }
}

export default withPortisProvider(Layout);
