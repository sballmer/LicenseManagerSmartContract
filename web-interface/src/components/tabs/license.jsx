import React from "react"
import { Button, Paper, Grid, Dialog } from '@material-ui/core';
import SearchBar from '../display/searchbar';
import Kanban from '../display/kanban';
import CheckBox from '../display/checkFilters';
import LicenseForm from "../modal/licenseForm";
import CreateForm from "../modal/createLicense";

class Licenses extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.openModal = this.openModal.bind(this);
    this.state = {
      modalOpen: false,
      modalContent: null,
      liToShow: [],
    }
  }

  componentDidMount() {
    this.setState({ liToShow: this.props.licenses });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.licenses !== this.props.licenses
      || prevProps.softwares !== this.props.softwares) {
      this.setState({
        liToShow: this.props.licenses,
      })
    }
  }

  handleSearch(filtered) {
    const { licenses } = this.props;
    const sWfiltered = filtered.map((sw) => sw.software_address.toUpperCase());
    const liToShow = licenses.filter((li) => sWfiltered.includes(li.software_address_linked.toUpperCase()));
    this.setState({ liToShow });
  }

  handleFilter(filter) {
    const { handleFilter } =this.props;
    if (!filter) {
      return;
    }
    handleFilter('li', filter);
  }

  openModal(action, item) {
    const {
      setForSale, setNewOwner, setExpiryDate, createLicense, softwares,
    } = this.props;
    let modalContent = null;
    switch(action) {
      case 'edit':
        modalContent = (
          <LicenseForm
            license={item}
            sellFunction={(args) => {
              setForSale(args);
              this.setState({ modalOpen: false });
            }}
            changeOwner={(args) => {
              setNewOwner(args);
              this.setState({ modalOpen: false });
            }}
            changeExpiryDate={setExpiryDate}
            closeFunction={() => this.setState({ modalOpen: false })}
          />
        );
        break;
      case 'create':
        modalContent = (
          <CreateForm
            softwares={softwares}
            createLicense={(args) => {
              createLicense(args)
              this.setState({ modalOpen: false })
            }}
            closeFunction={() => this.setState({ modalOpen: false })}
          />
        );
        break;
      default:
        break;
    }
    this.setState({
      modalOpen: true,
      modalContent,
    });
  }

  render() {
    const { softwares, address, filters } = this.props;
    const { modalOpen, modalContent, liToShow } = this.state;

    return (
      <Paper elevation={0} style={{ backgroundColor: '#bec9e2', width: '100%' }}>
        <Grid>
          <CheckBox
            filters={filters}
            handleFilter={this.handleFilter}
          />
          <SearchBar items={softwares} searchField="name" handleSearch={this.handleSearch} />
          <Button
            disabled={!softwares.length}
            variant="contained"
            color="primary"
            style={{ width: '180px', margin: '5px 5px 18px 5px' }}
            onClick={() => this.openModal('create')}
          >
            Create license
          </Button>
        </Grid>
        <Grid>
          {liToShow && liToShow.length ? liToShow.map(el => (
            <Kanban
              key={el.license_address}
              wallet={address}
              title={el.name}
              admin={el.admin}
              address={el.license_address}
              date={el.expiration_timestamp}
              dateLabel="Expiry: "
              version={el.version}
              forSale={el.license_for_sale}
              owner={el.owner}
              openKanban={() => this.openModal('edit', el)}
              buttonLabel="View details"
              disableButton={el.admin.toUpperCase() !== address.toUpperCase()
                && el.owner.toUpperCase() !== address.toUpperCase()}
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

export default Licenses;
