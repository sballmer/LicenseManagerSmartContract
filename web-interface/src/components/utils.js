// general functions

const axios = require('axios');


export function get_ETH_USD_rate() {
    return axios.get('https://api.coinbase.com/v2/prices/eth-usd/buy')
        .then(({ data }) => {
            showLogs({ msg: data, type: '[INFO]' });
            if (data && data.data) return parseFloat(data.data.amount);
            return null;
        })
        .catch(() => null);
}

export function showLogs({ msg = '', type = '[ERROR]' }) {
  if (process.env.NODE_ENV === "development" && process.env.DEBUG === true) console.info(type + msg);
}

export function typeCheckAddress(address, prefix=true) {
    if (typeof address !== 'string') return false;
    let regex = null;
    if (prefix) regex = /^0x[0-9a-fA-F]{40}$/;
    if (!prefix) regex = /^[0-9a-fA-F]{40}$/;
    return regex.test(address);
}

// functions to talk with smart contracts

const gasUseEveryWhere = 2200000;
const NULL_ADR = "0x0000000000000000000000000000000000000000"
const FOR_SALE_NO_FILTER = 2;
const BINANCE_TESTNET_ID = 97;

const wei2eth = (amount) => {
    return parseFloat(amount) / 1000000000000000000;
}

const eth2wei = (web3, amount) => {
    const amt = parseInt(web3.utils.toWei(parseFloat(amount).toFixed(18), 'ether'))
     return "0x" + amt.toString(16);
}

async function _signTransaction(contract, web3, tx_call, acc) {
  const netId = await web3.eth.net.getId().then(r => r).catch(() => null)
  const binanceNetwork = netId === BINANCE_TESTNET_ID;
  const account = web3.utils.toChecksumAddress(acc);
  var nonce = null;  
    return web3.eth.getTransactionCount(account)
      .then(tx_count => {
        if (binanceNetwork) return null;
        nonce = '0x' + (tx_count).toString(16);
        return tx_call.estimateGas().then(r => {
            if (r) {
                return web3.utils.numberToHex(
                    web3.utils.numberToHex(Math.ceil(web3.utils.hexToNumber(r) * 1.101)));
            }
            return r;
        }).catch(() => null);
      })
      .then(gas => {
        const tx_data = {
            nonce: nonce,
            data: tx_call.encodeABI(),
            from: account,
            gas: gas || gasUseEveryWhere,
            gasPrice: binanceNetwork ? parseInt(gasUseEveryWhere * 10) : undefined,
            to: contract.options.address,
            // averagePriceWeiHex: '0x1d7cc3dea',
            // protocolId:"c455f775-7385-4022-8afd-2af9df37d5b4",
        };
        showLogs({ type: '[INFO]:', msg: "transaction data" + JSON.stringify(tx_data) });

        return web3.eth.signTransaction(tx_data)
            .catch((err) => {
                if (err && err.code === -32603) {
                    return web3.eth.signTransaction({
                        ...tx_data,
                        nonce: web3.utils.numberToHex(web3.utils.hexToNumber(tx_data.nonce) + 1),
                    });
                }
                return err;
            })
      })
      .then(signedTx => {
          showLogs({ type: '[INFO]:', msg: "signed transaction" + JSON.stringify(signedTx) });
          return web3.eth.sendSignedTransaction(signedTx.raw);
      })
      .then(res => {
          showLogs({ type: '[INFO]:', msg: "successfully sent signed transaction\n" + res });
          return res;
      })
      .catch(err => {
          console.error("An error occured while calling a payable func:", err);
          return false;
      });
}

export function SC_buy_license(new_owner, li_contract, price, web3) {
    return web3.eth.sendTransaction({from: new_owner, to: li_contract, value: eth2wei(web3, price)})
}


// SH functions
export function SH_addSoftware(contract_sh, web3, account, name, version, license_time_default, software_admin) {
  if (!web3 || !account || !name || !version || !software_admin) return Promise.resolve(false);

  const tx_call = contract_sh.methods.addSoftware(name, version, license_time_default, web3.utils.toChecksumAddress(software_admin))
  return _signTransaction(contract_sh, web3, tx_call, account);
}

export function SH_get_softwares_from_index(contract_sh, index) {
    return contract_sh.methods.softwares(index).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `software[${index}]'s address is ${res}` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function SH_get_softwares_index_from_address(contract_sh, address) {
    if (!address) return false;
    return contract_sh.methods.softwareIndex(address).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `software with address ${address} is stored at index ${res}` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function SH_get_nb_of_softwares (contract_sh) {
    return contract_sh.methods.getNbOfSoftware().call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `Nb of software${res > 1 ? 's' : ''} present in the current SoftwareHandle: ${res}` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function SH_remove_software_from_index (contract_sh, web3, account, index) {
  if (!web3 || !account) 
    return false;

  const tx_call = contract_sh.methods.removeSoftware(index);
  return _signTransaction(contract_sh, web3, tx_call, account);
}

export function SH_remove_software(contract_sh, web3, account, address) {
  if (!web3 || !account || !address) 
    return false;

  const tx_call = contract_sh.methods.removeSoftware(address);
  return _signTransaction(contract_sh, web3, tx_call, account);
}

export function SH_get_softwares_with_admin(contract_sh, admin) {
    if (!admin) return false;
    return contract_sh.methods.get_softwares_with_admin(admin).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: "software owned by admin" + res })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function SH_list_softwares(contract_sh) {
  return contract_sh.methods.getNbOfSoftware().call()
  .then(size => {
      const promises = [];

      for (let i = 0 ; i < size ; i++) 
          promises.push(contract_sh.methods.softwares(i).call());

      return Promise.all(promises);
  })
  .then(res => {
      if (res.length === 0) {
          showLogs({ type: '[INFO]:', msg: "nb of software found = 0" })
          return [];
      }
      else {
          for (let i = 0 ; i < res.length ; i++) {
              showLogs({ type: '[INFO]:', msg: `[${i}] ${res[i]}` });
          }
          showLogs({ type: '[INFO]:', msg: `Total nb of softwares: ${res.length}` })
          return res;
      }
  })
  .catch(err => {
      console.error("An error occured while calling the func:", err);
      return false;
  });
}

export function SH_get_licenses_with_admin(contract_sh, admin) {
  if (!admin) return false;
    return contract_sh.methods.getLicenses(admin, NULL_ADR, FOR_SALE_NO_FILTER).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `all licenses with admin ${admin}:\n${res}` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function SH_get_licenses_with_owner(contract_sh, owner) {
  if (!owner) return false;
    return contract_sh.methods.getLicenses(NULL_ADR, owner, FOR_SALE_NO_FILTER).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `all licenses with owner ${owner}:\n${res}` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function SH_get_licenses_that_are_for_sale(contract_sh, for_sale=true) {
  var for_sale_int = for_sale ? 1 : 0;
    return contract_sh.methods.getLicenses(NULL_ADR, NULL_ADR, for_sale_int).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `all licenses that are ${for_sale?"":"NOT "}for sale:\n${res}` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function SH_get_licenses_filtered(contract_sh, admin, owner, for_sale) {
  if (!owner || !admin) return false;
    return contract_sh.methods.getLicenses(admin, owner, for_sale).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `all licenses filtered:\n${res}` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

// S functions
export function S_set_admin (contract_s, web3, account, admin_address) {
  if (!web3 || !account || !admin_address) 
    return false;

  const tx_call = contract_s.methods.set_admin(admin_address);
  return _signTransaction(contract_s, web3, tx_call, account);
}

export function S_set_name (contract_s, web3, account, name) {
  if (!web3 || !account || !name) 
    return false;

  const tx_call = contract_s.methods.set_name(name);
  return _signTransaction(contract_s, web3, tx_call, account);
}

export function S_set_version (contract_s, web3, account, version) {
  if (!web3 || !account || !version) 
    return false;

  const tx_call = contract_s.methods.set_version(version);
  return _signTransaction(contract_s, web3, tx_call, account);
}

export function S_set_license_time_default (contract_s, web3, account, license_time_default) {
  if (!web3 || !account || !license_time_default) 
    return false;

  const tx_call = contract_s.methods.set_license_time_default(license_time_default);
  return _signTransaction(contract_s, web3, tx_call, account);
}

export function S_get_licenses_from_index(contract_s, index) {
    return contract_s.methods.licenses(index).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `license[${index}]'s address is: ${res}` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function S_get_license_index_from_address(contract_s, address) {
    if (!address) return false;
    return contract_s.methods.licenseIndex(address).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `license with address ${address} is stored at index ${res}` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function S_get_software_info(contract_s) {
    return contract_s.methods.get_informations().call()
    .then(res => {
        const results = {
          'name' : res['0'],
          'version' : res['1'],
          'license_time_default': res['2'],
          'admin' : res['3'],
          'nb_license': res['4'],
          'software_address': res['5'],
        }
        showLogs({ type: '[INFO]:', msg: `name: ${results['name']}, version: ${results['version']}, license_time_default: ${results['license_time_default']}, admin: ${results['admin']}, nb_license: ${results['nb_license']}, software address: ${results['software_address']}` });
        return results;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function S_get_license_info_from_index(contract_s, index) {
    return contract_s.methods.get_license_informations(index).call()
    .then(res => {
        const results = {
          'admin' : res['0'],
          'owner' : res['1'],
          'software_address_linked': res['2'],
          'expiration_timestamp' : res['3'],
          'license_for_sale': res['4'],
          'selling_price_wei': res['5'],
          'selling_price_ETH': String(wei2eth(res['5'])),
          'license_address': res['6'],
        }
        showLogs({ type: '[INFO]:', msg: `admin: ${results['admin']}, owner: ${results['owner']}, software_address_linked: ${results['software_address_linked']}, expiration_timestamp: ${results['expiration_timestamp']}, license_for_sale: ${results['license_for_sale']}, selling_price in wei: ${results['selling_price_wei']} and in ETH/BNB: ${results['selling_price_ETH']}, license address: ${results['license_address']}` });
        return results;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function S_get_licenses_for_sale(contract_s, for_sale_bool=true) {
    return contract_s.methods.get_licenses_for_sale(for_sale_bool).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `list of license that are ${for_sale_bool?'':'not '}for sale: ${res}` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

// using this function will create a license that has the expiration_timestamp determined by the parameter license_time_default
export function S_add_license_default_expiration(contract_s, web3, account, admin, owner) {
  if (!web3 || !account || !admin || !owner) 
    return false;

  const tx_call = contract_s.methods.add_license(admin, owner);
  return _signTransaction(contract_s, web3, tx_call, account);
}

// using this function will create a license that has the expiration_timestamp NOT determined by the parameter license_time_default
// expiration_timestamp means the license has no expiration date
export function S_add_license(contract_s, web3, account, admin, owner, expiration_timestamp=0) {
  if (!web3 || !account || !admin || !owner)
    return false;
  const tx_call = contract_s.methods.add_license(admin, owner, 0);
  return _signTransaction(contract_s, web3, tx_call, account);
}

export function S_get_nb_license(contract_s) {
    return contract_s.methods.get_nb_license().call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `there is ${res} licenses in this Software.` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function S_check_license(contract_s, owner) {
    if (!owner) return false;
    return contract_s.methods.check_license(owner).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `User ${owner} has ${res?"":"NOT"} access to the software.` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function S_get_license_with_admin(contract_s, admin) {
    if (!admin) return false;
    return contract_s.methods.get_licenses_with_admin(admin).call()
    .then(res => {
    console.log("🚀 ~ file: utils.js ~ line 418 ~ S_get_license_with_admin ~ res", res)
        showLogs({ type: '[INFO]:', msg: `Licenses list with admin ${admin}: ${res}` })
        return res;
    })
    .catch(err => {
    console.log("🚀 ~ file: utils.js ~ line 423 ~ S_get_license_with_admin ~ err", err)
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function S_get_license_with_owner(contract_s, owner) {
    if (!owner) return false;
    return contract_s.methods.get_licenses_with_owner(owner).call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: `Licenses list with owner ${owner}: ${res}` })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function S_remove_license_with_index(contract_s, web3, account, index) {
  if (!web3 || !account) 
    return false;

  const tx_call = contract_s.methods.removeLicense(index);
  return _signTransaction(contract_s, web3, tx_call, account);
}

export function S_remove_license_with_address(contract_s, web3, account, adr) {
  if (!web3 || !account || !adr) 
    return false;

  const tx_call = contract_s.methods.removeLicense(adr);
  return _signTransaction(contract_s, web3, tx_call, account);
}

export function S_get_info_software_and_all_licenses(contract_s) {
    var software_info = null;
    return S_get_software_info(contract_s)
    .then(res => {
        software_info = res;
        const promises = [];

        for (let i = 0 ; i < software_info['nb_license'] ; i++) {
          promises.push(S_get_license_info_from_index(contract_s, i));
        }
        return Promise.all(promises);
    })
    .then(res => {
      const results = {
        'software' : software_info,
        'licenses' : [],
      };

      for (let el of res) {
        results['licenses'].push(el);
      }

      return results;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function S_list_licenses(contract_s) {
  return contract_s.methods.get_nb_license().call()
  .then(size => {
      const promises = [];
      for (let i = 0 ; i < size ; i++) {
          promises.push(contract_s.methods.licenses(i).call());
      }
      return Promise.all(promises);
  })
  .then(res => {
      if (res.length === 0) {
          showLogs({ type: '[INFO]:', msg: "nb of license found = 0" })
          return [];
      }
      else {
          for (let i = 0 ; i < res.length ; i++) {
              showLogs({ type: '[INFO]:', msg: `[${i}] ${res[i]}` });
          }
          showLogs({ type: '[INFO]:', msg: `Total nb of licenses: ${res.length}` })
          return res;
      }
  })
  .catch(err => {
      console.error("An error occured while calling the func:", err);
      return false;
  });
}

export function S_get_admin(contract_s) {
  return contract_s.methods.admin().call()
  .then(adr => {
      showLogs({ type: '[INFO]:', msg: "Admin address:", adr })
      return adr;
  })
  .catch(err => {
      console.error("An error occured while calling the func:", err);
      return false;
  });
}

export function S_get_name(contract_s) {
    return contract_s.methods.name().call()
    .then(adr => {
        showLogs({ type: '[INFO]:', msg: "Company name:", adr })
        return adr;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function S_get_version(contract_s) {
    return contract_s.methods.version().call()
    .then(ver => {
        showLogs({ type: '[INFO]:', msg: "Version name:", ver })
        return ver;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function S_get_time_default(contract_s) {
    return contract_s.methods.license_time_default().call()
    .then(res => {
        showLogs({ type: '[INFO]:', msg: "Company name:", res })
        return res;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

// L functions
export function L_get_informations(contract_l) {
    return contract_l.methods.get_informations().call()
    .then(res => {
        const results = {
          'admin' : res['0'],
          'owner' : res['1'],
          'software_address_linked': res['2'],
          'expiration_timestamp' : res['3'],
          'license_for_sale': res['4'],
          'selling_price_wei': res['5'],
          'selling_price_ETH': String(wei2eth(res['5'])),
          'license_address': res['6'],
        }
        showLogs({ type: '[INFO]:', msg: `admin: ${results['admin']}, owner: ${results['owner']}, software_address_linked: ${results['software_address_linked']}, expiration_timestamp: ${results['expiration_timestamp']}, license_for_sale: ${results['license_for_sale']}, selling_price in wei: ${results['selling_price_wei']} and in ETH/BNB: ${results['selling_price_ETH']}, license address: ${results['license_address']}` });
        return results;
    })
    .catch(err => {
        console.error("An error occured while calling the func:", err);
        return false;
    });
}

export function L_get_owner(contract_l) {
  return contract_l.methods.owner().call()
  .then(res => {
      showLogs({ type: '[INFO]:', msg: "current owner:", res });
      return res;
  })
  .catch(err => {
      console.error("An error occured while calling the func:", err);
      return false;
  });
}

export function L_set_owner(contract_l, web3, account, owner) {
  if (!web3 || !account) return false;

  const tx_call = contract_l.methods.set_owner(owner);
  return _signTransaction(contract_l, web3, tx_call, account);
}

export function L_get_admin(contract_l) {
  return contract_l.methods.admin().call()
  .then(res => {
      showLogs({ type: '[INFO]:', msg: "current admin:" + res })
      return res;
  })
  .catch(err => {
      console.error("An error occured while calling the func:", err);
      return false;
  });
}

export function L_set_admin(contract_l, web3, account, admin) {
  if (!web3 || !account) return false;

  const tx_call = contract_l.methods.set_admin(admin);
  return _signTransaction(contract_l, web3, tx_call, account);
}

export function L_get_expiration_timestamp(contract_l) {
  return contract_l.methods.expiration_timestamp().call()
  .then(res => {
      showLogs({ type: '[INFO]:', msg: "current expiration timestamp: " + res })
      return res;
  })
  .catch(err => {
      console.error("An error occured while calling the func:", err);
      return false;
  });
}

export function L_set_expiration_timestamp(contract_l, web3, account, timestamp=0) {
  if (!web3 || !account) return false;

  const tx_call = contract_l.methods.set_expiration_timestamp(timestamp);
  return _signTransaction(contract_l, web3, tx_call, account);
}

export function L_remove_expiration_timestamp(contract_l, web3, account) {
    if (!web3 || !account) return false;

    const tx_call = contract_l.methods.remove_expiration_timestamp();
    return _signTransaction(contract_l, web3, tx_call, account);
}

export function L_get_is_for_sale(contract_l) {
  return contract_l.methods.license_for_sale().call()
  .then(res => {
      showLogs({ type: '[INFO]:', msg: "is for sale: " + res })
      return res;
  })
  .catch(err => {
      console.error("An error occured while calling the func:", err);
      return false;
  });
}

export function L_get_selling_price(contract_l) {
  contract_l.methods.selling_price().call()
  .then(res => {
      const price = wei2eth(parseInt(res));
      showLogs({ type: '[INFO]:', msg: `selling price:  ${price} ETH   =   ${res} wei` })
      return { price, wei: res };
  })
  .catch(err => {
      console.error("An error occured while calling the func:", err);
      return false;
  });
}

export function L_set_for_sale(contract_l, web3, account, price=0.0001) {
  if (!web3 || !account) return false;

  const tx_call = contract_l.methods.set_for_sale(eth2wei(web3, price));
  return _signTransaction(contract_l, web3, tx_call, account);
}

export function L_remove_for_sale(contract_l, web3, account) {
    if (!web3 || !account) return false;

    const tx_call = contract_l.methods.remove_for_sale();
    return _signTransaction(contract_l, web3, tx_call, account);
}

// events

export function subscribe_SH_software_added(contract_sh, callback) {
    contract_sh.events.softwareAdded({}, (error, res) => {
        if (error) {
            console.error(error);
            return false;
        }
        showLogs({ type: '[INFO]:', msg: `a new software was added: ${res.returnValues['0']}` });
        callback('sw_added', res.returnValues['0']);
    });
}
