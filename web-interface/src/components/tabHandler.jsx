import React from "react"
import { Grid, ButtonGroup, Button } from '@material-ui/core';

import abi from '../config/abi';
import * as func from './utils';
import SoftwarePage from './tabs/software';
import LicensePage from './tabs/license';
import BuyPage from './tabs/buy';
import { LoaderBar } from './display/loader';


class TabProvider extends React.Component {
  constructor(props) {
    super(props);
    this.reloadStates = this.reloadStates.bind(this);
    this.loadSoftwares = this.loadSoftwares.bind(this);
    this.getSWinfo = this.getSWinfo.bind(this);
    this.loadForSale = this.loadForSale.bind(this);
    this.setLAdmin = this.setLAdmin.bind(this);
    this.setLiForSale = this.setLiForSale.bind(this);
    this.setNewLiOwner = this.setNewLiOwner.bind(this);
    this.setLiExpiryDate = this.setLiExpiryDate.bind(this);
    this.createLicense = this.createLicense.bind(this);
    this.createSoftware = this.createSoftware.bind(this);
    this.removeSoftware = this.removeSoftware.bind(this);
    this.buyLicense = this.buyLicense.bind(this);
    this.handleFilter = this.handleFilter.bind(this);

    this.onEvent = this.onEvent.bind(this);

    this.state = {
      contractAddress: null,
      contract_sh: null,
      type: 'software',
      allSW: [],
      allLicenses: [],
      swToShow: [],
      liToShow: [],
      liForSale: [],
      refresh: true,
      loader: false,
      xrate: null,
      filters_li: {
        admin: { tag: 'admin', state: true, label: 'Administrated' },
        // owner: { tag: 'owner', state: false, label: 'Owned' },
        // offers: { tag: 'offers', state: false, label: 'My offers' },
      },
    }
  }

  componentDidMount() {
    const { web3 } = this.props;
    let contractAddress = process.env.ROPSTEN_CONTRACT_HANDLER;
    if (this.props.network && this.props.network.includes('binance')) contractAddress = process.env.BINANCE_CONTRACT_HANDLER;
    const contract_sh = new web3.eth.Contract(abi.HANDLER_ABI, contractAddress)
    func.get_ETH_USD_rate()
      .then((res) => {
        if (res) this.setState({ xrate: res });
      })
    func.subscribe_SH_software_added(contract_sh, this.onEvent)
    this.setState({
      contractAddress,
      contract_sh,
    }, this.loadSoftwares);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.network !== this.props.network) {
      const { web3 } = this.props;
      let contractAddress = process.env.ROPSTEN_CONTRACT_HANDLER;
      if (this.props.network && this.props.network.includes('binance')) contractAddress = process.env.BINANCE_CONTRACT_HANDLER;
      const contract_sh = new web3.eth.Contract(abi.HANDLER_ABI, contractAddress)
      this.setState({
        contractAddress,
        contract_sh,
      }, this.reloadStates);
    }
  }

  onEvent(event, args) {
    switch(event) {
      case 'sw_added':
        alert('Congrats ! New software created !');
        this.loadSoftwares();
        break;
      default:
        break;
    }
    // window.location.reload();
  }

  reloadStates(type) {
    switch (type) {
      case 'software':
        this.loadSoftwares();
        break;
      case 'license':
        this.loadLicenses();
        break;
      case 'buy':
        this.loadForSale();
        break;
      default:
        this.loadSoftwares();
        break;
    }
    this.setState({ type: type || 'software' });
  }

  loadSoftwares(forceReload=true) {
    const { allSW, contract_sh } = this.state;
    const { address, web3 } = this.props;

    if (allSW && allSW.length && !forceReload) {
      this.setState(prevState => ({ refresh: !prevState.refresh }));
      return;
    }
    func.SH_get_softwares_with_admin(contract_sh, address)
      .then((softwares) => {
        if (softwares) {
          Promise.all(softwares.map((swAddress) => {
            const contract_s = new web3.eth.Contract(abi.SOFTWARE_ABI, swAddress);
            return func.S_get_software_info(contract_s)
              .then((swInfo) => (swInfo ? {
                ...swInfo,
                total: swInfo.nb_license,
                expiry: swInfo.license_time_default,
                address: swAddress,
                contract: contract_s,
              } : null))
          }))
            .then((result) => {
              this.setState({ allSW: result, swToShow: result });
            })
        }
      })
  }

  getSWinfo(software) {
    const { address, web3 } = this.props;
    func.S_get_info_software_and_all_licenses(software.contract, web3, address)
      .then((details) => {
        if (details) {
          this.setState((prevState) => {
            const newLicenses = details.licenses
              .map((li) => ({
                name: software.name,
                version: software.version,
                admin_s: software.admin,
                contract_s: software.contract,
                contract_l: new web3.eth.Contract(abi.LICENSE_ABI, li.license_address),
                ...li,
              }));
            return {
              liToShow: newLicenses,
              type: 'license',
              filters_li: {
                ...prevState.filters_li,
                admin: { tag: 'admin', state: true, label: 'Adminisatrated' },
              },
            };
          });
        } else {
          console.error('ERROR: could not query software');
        }
      });
  }

  async loadLicenses() {
    const { address, web3 } = this.props;
    const { contract_sh } = this.state;
    const liAdr = await func.SH_get_licenses_with_admin(contract_sh, address)
      .then((asAdmin) => func.SH_get_licenses_with_owner(contract_sh, address)
        .then((asOwner) => {
          return [...new Set([...asOwner, ...asAdmin])];
        }))
        .catch(() => ([]));

    const allLiwithSw = await Promise.all(liAdr.map((adr) => {
        const contract_l = new web3.eth.Contract(abi.LICENSE_ABI, adr);
        return func.L_get_informations(contract_l).then((info) => ({ ...info, contract_l }));
      }))
        .then(async (allLi) => {
          if (allLi && allLi.length) {
            return Promise.all(allLi.map((currentLi) => {
              const contract_s = new web3.eth.Contract(abi.SOFTWARE_ABI, currentLi.software_address_linked);
              return func.S_get_software_info(contract_s)
                .then((swInfo) => (swInfo ? {
                  ...swInfo,
                  ...currentLi,
                  admin: swInfo.admin,
                  address: currentLi.license_address,
                  contract_s,
                } : null));
              }));
          }
          return false;
        })
        .catch(() => null);

    if (allLiwithSw && allLiwithSw.length) {
      this.setState(prevState => ({
        allLicenses: allLiwithSw,
        liToShow: allLiwithSw,
        filters_li: {
          ...prevState.filters_li,
          admin: { tag: 'admin', state: false, label: 'Administrated' },
        }
      }))
    }
  }

  loadForSale() {
    const { contract_sh } = this.state;
    const { web3 } = this.props;
    return func.SH_get_licenses_that_are_for_sale(contract_sh)
      .then(licenses => {
        return Promise.all(licenses.map((address) => {
          const contract = new web3.eth.Contract(abi.LICENSE_ABI, address);
          return func.L_get_informations(contract)
            .then((item) => ({ contract, ...item }))
            .catch(() => ({}));
        }));
      })
      .then((allForSale) => {
        return Promise.all(allForSale.map((license) => {
          const contract_s = new web3.eth.Contract(abi.SOFTWARE_ABI, license.software_address_linked);
          return func.S_get_software_info(contract_s)
            .then((result) => {
              return { ...result, ...license, contract_s }
            })
            .catch(() => license);
        }))
        .then((forSale) => {
          this.setState({ liForSale: forSale })
        });
      })
      .catch((err) => console.error(err));
  }

  createSoftware({ date, name, version }) {
    const { contract_sh } = this.state;
    const { web3, address } = this.props;
    this.setState({ loader: true })
    func.SH_addSoftware(contract_sh, web3, address, name, version, date, address)
      .then((res) => (res ? null : alert('! Software creation failed...')))
      .finally(() => this.setState({ loader: false }))
  }

  removeSoftware(software) {
    const { contract_sh } = this.state;
    const { web3, address } = this.props;
    this.setState({ loader: true })
    func.SH_remove_software(contract_sh, web3, address, software.address)
      .then((res) => {
        if (res) {
          alert('Software removed !');
          this.loadSoftwares();
        }
      })
      .finally(() => this.setState({ loader: false }))
  }

  setLAdmin({ license, admin }) {
    if (!func.typeCheckAddress(admin)) {
      alert('WARNING: address invalid characters !');
      return;
    }
    const { web3, address } = this.props;
    this.setState({ loader: true })
    func.L_set_owner(license.contract, web3, address, admin)
      .then((res) => {
        if (res) alert('License successfuly changed owner !');
        else alert('! License owner change failed...');
      })
      .finally(() => this.setState({ loader: false }))
  }

  setLiForSale({ license, priceETH }) {
    const { web3, address } = this.props;
    this.setState({ loader: true })
    func.L_set_for_sale(license.contract_l, web3, address, priceETH)
      .then(res => {
        if (res) {
          alert('License is for sale !', res)
          this.loadLicenses()
        } else {
          alert('! License set for sale failed...')
        }
      })
      .finally(() => this.setState({ loader: false }))
  }

  setNewLiOwner({ license, newOwner }) {
    if (!func.typeCheckAddress(newOwner)) {
      alert('WARNING: New owner address invalid characters !');
      return;
    }
    const { web3, address } = this.props;
    this.setState({ loader: true })
    func.L_set_owner(license.contract_l, web3, address, newOwner)
      .then(res => (res ? alert('License owner changed !', res) : alert('! License owner change faild...')))
      .finally(() => this.setState({ loader: false }))
  }

  setLiExpiryDate({ license, newDate }) {
    console.info("Set new owner LICENSE: not implemented", license, newDate)
  }

  createLicense({ date, software }) {
    const { web3, address } = this.props;
    if (address.toUpperCase() !== software.admin.toUpperCase()) {
      alert('! You are not admin of this software !');
      return;
    }
    this.setState({ loader: true })
    func.S_add_license(software.contract, web3, address, software.admin, address, date)
      .then((res) => {
        if (res) {
          alert('New license created !');
          this.loadLicenses();
        } else {
          alert('! License creation failed...');
        }
      })
      .finally(() => this.setState({ loader: false }))
  }

  buyLicense({ toBuy }) {
    const { web3, address } = this.props;
    this.setState({ loader: true })
    func.SC_buy_license(address, toBuy.license_address, parseFloat(toBuy.selling_price_ETH), web3)
      .then(res => {
        if(res) {
          alert('New license aquired !');
          this.loadForSale();
        }
      })
      .finally(() => this.setState({ loader: false }))
  }

  handleFilter(type, filter) {
    const { address } =this.props;
    this.setState(prevState => {
      if (type === 'li') {
        return {
          filters_li: {
            ...prevState.filters_li,
            [filter.tag]: { ...filter, state: !filter.state },
          },
          liToShow: filter.state
            ? prevState.allLicenses.length ? prevState.allLicenses : prevState.liToShow
            : prevState.liToShow.filter(el => (
              el[filter.tag] && el[filter.tag].toUpperCase() ? el[filter.tag].toUpperCase() === address.toUpperCase() : false)),
        };
      }
    });
  }

  render() {
    const {
      type, allSW, swToShow, liToShow, liForSale, refresh, loader,
      filters_li, xrate,
    } = this.state;
    const { address, logged } = this.props;

    let content = null;
    switch (type) {
      case 'software':
        content = (
          <SoftwarePage
            key={`key${String(refresh)}`}
            softwares={allSW}
            loadSoftwares={this.loadSoftwares}
            getSWinfo={(args) => {
              this.getSWinfo(args)
            }}
            createSoftware={this.createSoftware}
            removeSoftware={this.removeSoftware}
            {...this.props}
          />
        );
        break;
      case 'license':
        content = (
          <LicensePage
            key={`key${String(refresh)}`}
            licenses={liToShow}
            softwares={swToShow.filter(sw => sw.admin.toUpperCase() === address.toUpperCase())}
            setForSale={this.setLiForSale}
            setNewOwner={this.setNewLiOwner}
            setExpiryDate={this.setLiExpiryDate}
            createLicense={this.createLicense}
            handleFilter={this.handleFilter}
            filters={filters_li}
            {...this.props}
          />
        );
        break;
      case 'buy':
        content = (
          <BuyPage
            key={`key${String(refresh)}`}
            licenses={liForSale}
            buyLicense={this.buyLicense}
            xrate={xrate}
            {...this.props}
          />
        );
        break;
      default:
        break;
    }

    const btnColor="#b1b8de";
    return (
      <Grid container justify="center">
        <Grid item xs={12} style={{ margin: '5px', textAlign: 'center' }}>
          <ButtonGroup color="primary" aria-label="outlined primary button group" disabled={!logged}>
            <Button
              variant="outlined"
              onClick={() => this.reloadStates('software')}
              style={{ backgroundColor: type === 'software' ? btnColor : "inherit" }}
            >
              My Softwares
            </Button>
            <Button
              variant="outlined"
              onClick={() => this.reloadStates('license')}
              style={{ backgroundColor: type === 'license' ? btnColor : "inherit" }}
            >
              My Licenses
            </Button>
            <Button
              variant="outlined"
              onClick={() => this.reloadStates('buy')}
              style={{ backgroundColor: type === 'buy' ? btnColor : "inherit" }}
            >
              Buy License
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item style={{ margin: '6px', width: '60vw' }}>
          {loader === true ? (
            <LoaderBar />
          ) : null}
        </Grid>
        <Grid style={{ minWidth: '70vw' }}>
          {content}
        </Grid>
      </Grid>
    );
  }
}

export default TabProvider;
