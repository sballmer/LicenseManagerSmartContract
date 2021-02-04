import React from "react"
import { Paper, Grid, Dialog } from '@material-ui/core';

import SearchBar from '../display/searchbar';
import Kanban from '../display/kanban';
import CheckBox from '../display/checkFilters';
import BuyForm from "../modal/buyForm";

class Buy extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.openModal = this.openModal.bind(this);
    this.state = {
      filters: {
        offers: { tag: 'offers', state: false, label: 'Exclude owned' }
      },
      modalContent: null,
      modalOpen: false,
      toShow: [],
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.licenses !== this.props.licenses) {
      this.setState({
        toShow: this.props.licenses,
      })
    }
  }

  handleSearch(filtered) {
    this.setState({
      toShow: filtered,
    });
  }

  handleFilter(filter) {
    const { licenses, address } = this.props;
    if (!filter) {
      return;
    }
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        [filter.tag]: { ...filter, state: !filter.state },
      },
      toShow: filter.state ? licenses : licenses.filter(el => el.owner.toUpperCase() !== address.toUpperCase()),
    }));
  }

  openModal(item) {
    const { buyLicense, xrate } = this.props;
    this.setState({
      modalOpen: true,
      modalContent: (
        <BuyForm
          license={item}
          xrate={xrate}
          buyFunction={() => {
            if (window.confirm('Do you want to buy this license ?')) {
              this.setState({ modalOpen: false })
              buyLicense({ toBuy: item })
            }
          }}
          closeFunction={() => this.setState({ modalOpen: false })}
        />
      ),
    });
  }

  render() {
    const { modalContent, filters, modalOpen, toShow } = this.state;
    const { licenses, address, xrate } = this.props;
    return (
      <Paper elevation={0} style={{ backgroundColor: '#bec9e2', width: '100%' }}>
        <Grid>
          <CheckBox
            filters={filters}
            handleFilter={this.handleFilter}
          />
          <SearchBar items={licenses} searchField="name" handleSearch={this.handleSearch} />
        </Grid>
        <Grid>
          {toShow && toShow.length ? toShow.map(el => (
            <Kanban
              key={el.license_address}
              wallet={address}
              title={el.name}
              admin={el.admin}
              address={el.license_address}
              date={el.expiration_timestamp}
              price={el.selling_price_ETH}
              xrate={xrate}
              dateLabel="Expiry: "
              version={el.version}
              owner={el.owner}
              disableButton={el.owner.toUpperCase() === address.toUpperCase()
                || el.admin.toUpperCase() === address.toUpperCase()}
              openKanban={() => this.openModal(el)}
              buttonLabel="Buy details"
            />
          )) : null}
        </Grid>
        <Dialog
          aria-labelledby="simple-dialog-title"
          fullScreen={visualViewport.width < 500}
          onClose={() => this.setState({ modalOpen: false })}
          open={modalOpen}
        >
          <div style={{ minHeight: '95vh', minWidth: '600px', maxWidth: '100vw' }}>
            {modalContent}
          </div>
        </Dialog>
      </Paper>
    );
  }
}

export default Buy;
