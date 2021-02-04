# Software Handle:

- `SH_addSoftware(contract_sh, web3, account, name, version, license_time_default, software_admin)`

- `SH_get_softwares_from_index(contract_sh, index)`

- `SH_get_softwares_index_from_address(contract_sh, address)`

- `SH_get_nb_of_softwares (contract_sh)`

- `SH_remove_software_from_index (contract_sh, web3, account, index)`

- `SH_remove_software (contract_sh, web3, account, address)`

- `SH_get_licenses_with_admin(constract_sh, admin)`

- `SH_get_licenses_with_owner(constract_sh, owner)`

- `SH_get_licenses_that_are_for_sale(constract_sh, for_sale=true)`


# Software: 

- `S_set_admin (contract_s, web3, account, admin_address)`

- `S_set_name (contract_s, web3, account, name)`

- `S_set_version (contract_s, web3, account, version)`

- `S_set_license_time_default (contract_s, web3, account, license_time_default)`

- `S_get_licenses_from_index(contract_s, index)`

- `S_get_license_index_from_address(contract_s, address)`

- `S_get_software_info(contract_s)`

- `S_get_license_info_from_index(contract_s, index)`

- `S_get_licenses_for_sale(contract_s, for_sale_bool=true)`

- `S_add_license_default_expiration(contract_s, web3, account, admin, owner)`

- `S_add_license(contract_s, web3, account, admin, owner, expiration_timestamp=0)`

- `S_get_nb_license(contract_s)`

- `S_check_license(contract_s, owner)`

- `S_get_license_with_admin(contract_s, admin)`

- `S_get_license_with_owner(contract_s, owner)`

- `S_remove_license_with_index(contract_s, web3, account, index)`

- `S_remove_license_with_address(contract_s, web3, account, adr)`


- `S_get_info_software_and_all_licenses(contract_s, web3, account)`

this function returns a data of this type with only one call for the software and one call for each license:

```
{
    "software": {
        "name": "softwareName",
        "version": "1.0.0",
        "license_time_default": "0",
        "admin": "0xFe5a44605eEd83DAe7e2CA1A83F84Ed61Ce38DCD",
        "nb_license": "2",
        "software_address": "0x72472d223D80D14e1669791233E809a230D61407"
    },
    "licenses": [
        {
            "admin": "0xFe5a44605eEd83DAe7e2CA1A83F84Ed61Ce38DCD",
            "owner": "0xFe5a44605eEd83DAe7e2CA1A83F84Ed61Ce38DCD",
            "software_address_linked": "0x72472d223D80D14e1669791233E809a230D61407",
            "expiration_timestamp": "0",
            "license_for_sale": false,
            "selling_price_wei": "0",
            "selling_price_ETH": "0",
            "license_address": "0x1E6b7fcFe44306aA1D5782DE693CD0Fa78b33F68"
        },
        {
            "admin": "0xFe5a44605eEd83DAe7e2CA1A83F84Ed61Ce38DCD",
            "owner": "0xFe5a44605eEd83DAe7e2CA1A83F84Ed61Ce38DCD",
            "software_address_linked": "0x72472d223D80D14e1669791233E809a230D61407",
            "expiration_timestamp": "0",
            "license_for_sale": true,
            "selling_price_wei": "5000000000000000",
            "selling_price_ETH": "0.005",
            "license_address": "0xd5de8C1F2474bC1DeA3E61601cB631659D95d7Bb"
        }
    ]
}
```


# License:

- `L_get_informations(contract_l)`