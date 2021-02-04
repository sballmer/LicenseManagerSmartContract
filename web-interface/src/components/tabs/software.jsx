import React from "react"
import { Button, Paper, Grid, Dialog } from '@material-ui/core';

import SearchBar from '../display/searchbar';
import Kanban from '../display/kanban';
import CreateForm from "../modal/createSoftware";

class Softwares extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.openKanban = this.openKanban.bind(this);
    this.state = {
      modalOpen: false,
      toShow: [],
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.softwares !== this.props.softwares) {
      this.setState({
        toShow: this.props.softwares,
      })
    }
  }

  handleSearch(filtered) {
    this.setState({
      toShow: filtered,
    });
  }

  openKanban(software) {
    const { getSWinfo } = this.props;
    getSWinfo(software);
  }

  render() {
    const { modalOpen, toShow } = this.state;
    const { softwares, createSoftware, address, removeSoftware } = this.props;
    return (
      <Paper elevation={0} style={{ backgroundColor: '#bec9e2', width: '100%' }}>
        <Grid>
          {/* <CheckBox
            filters={[{ tag: 'mine', state: true, label: 'My softwares' }]}
            disabled
            handleFilter={() => null}
          /> */}
          <SearchBar items={softwares} searchField="name" handleSearch={this.handleSearch} />
          <Button
            variant="contained"
            color="primary"
            style={{ width: '180px', margin: '5px 5px 18px 5px' }}
            onClick={() => this.setState({ modalOpen: true })}
          >
            Create software
          </Button>
        </Grid>
        <Grid>
          {toShow && toShow.length ? toShow.map(el => (
            <Kanban
              key={el.address}
              title={el.name}
              wallet={address}
              admin={el.admin}
              address={el.address}
              // date={el.license_time_default}
              // dateLabel="Expiry: "
              total={el.nb_license}
              totalLabel="Number of licenses "
              version={el.version}
              disableButton={!parseInt(el.nb_license)}
              openKanban={() => this.openKanban(el)}
              actionRemove={
                null}
                // () => {
                //   if (window.confirm('Do you want to remove this software with all of its licenses ?'))
                //     removeSoftware(el)
                // }}
              buttonLabel="View Licenses"
            />
          )) : null}
        </Grid>
        <Dialog
          aria-labelledby="simple-dialog-title"
          fullWidth
          onClose={() => this.setState({ modalOpen: false })}
          open={modalOpen}
        >
          <div style={{ minHeight: '95vh', minWidth: '600px', maxWidth: '100vw' }}>
            <CreateForm
              createSoftware={createSoftware}
              closeFunction={() => this.setState({ modalOpen: false })}
            />
          </div>
        </Dialog>
      </Paper>
    );
  }
}

export default Softwares;
