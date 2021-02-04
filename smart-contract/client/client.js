const fs = require('fs'); 
const Web3 = require('web3');
// const Provider_HdWallet = require('@truffle/hdwallet-provider');
const { ethers } = require('ethers');

address_account_1 = '0xFe5a44605eEd83DAe7e2CA1A83F84Ed61Ce38DCD';
private_account_1 = '0x0000000000000000000000000000000000000000000000000000000000000000';

address_account_2 = '0xdead29e9dd478451c6852f4278cA07DEED98F706';
private_account_2 = '0x0000000000000000000000000000000000000000000000000000000000000000';

address_account_3 = '0xcAfe849aE18c3F2Eb28c7f9cA0A6373fBF754249';
private_account_3 = '0x0000000000000000000000000000000000000000000000000000000000000000';

address_account_4 = '0xbAbe15C7c5D88bD040D079473B98FD1B0AFa1188';
private_account_4 = '0x0000000000000000000000000000000000000000000000000000000000000000';


// ------------------- TO MODIFY ---------------------------

// select the account to use:
const privateKey = private_account_1;

// contract file
const file_solidity = '../contract.sol';

// node link
const infura_api_key = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
const eth_node_link_infura_ropsten = "wss://ropsten.infura.io/ws/v3/" + infura_api_key

// compiler version
const solidity_compiler_version = 'v0.7.6+commit.7338295f';
// ------------------- END OF TO MODIFY ---------------------------

var web3 = new Web3(eth_node_link_infura_ropsten);
account = web3.eth.accounts.privateKeyToAccount(privateKey)
account_1 = web3.eth.accounts.privateKeyToAccount(private_account_1);
account_2 = web3.eth.accounts.privateKeyToAccount(private_account_2);
account_3 = web3.eth.accounts.privateKeyToAccount(private_account_3);
account_4 = web3.eth.accounts.privateKeyToAccount(private_account_4);

var ethers_signer = new ethers.Wallet(account.privateKey, new ethers.providers.InfuraProvider('ropsten', infura_api_key));

function compile_contracts(optimize=true) {
	return new Promise( (resolve, reject) => {

		console.log("Loading compiler...")
		require('solc').loadRemoteVersion(solidity_compiler_version, (err, solc) => {
			if (err) {
				console.error("ERROR", err); 
				reject(err);
			}
			else {
				console.log("Successfully imported solidity compiler: " + solidity_compiler_version)

				var input = {
					language: 'Solidity',
					sources: { 
						contract_file: { content: fs.readFileSync(file_solidity).toString() }
					},
					settings: { 
						optimizer: { enabled: optimize},
						outputSelection: {'*': {'*': ['*'] }}
					}
				};

				var output = JSON.parse(solc.compile(JSON.stringify(input)));
				console.log("Successfully compiled contract")

				for (let contractName in output.contracts.contract_file) {
					console.log("exporting contract", contractName)
					fs.writeFileSync('../' + contractName + '_bytecode.json', JSON.stringify(output.contracts.contract_file[contractName].evm.bytecode, 0, 2));
					fs.writeFileSync('../' + contractName + '_abi.json', JSON.stringify(output.contracts.contract_file[contractName].abi, 0, 2));
				}

				resolve();
			} 
		});
	});
}

function deploy_contract(contractName='SoftwareHandler') {

	return new Promise( (resolve, reject) => {
		// Using the signing account to deploy the contract
		factory = new ethers.ContractFactory(
					JSON.parse(fs.readFileSync('../' + contractName + '_abi.json').toString()),
					JSON.parse(fs.readFileSync('../' + contractName + '_bytecode.json').toString()), 
					ethers_signer);
		contract = null 
		factory.deploy()
			.then(res => {
				contract = res;
				console.log('Mining transaction...');
				console.log(`https://ropsten.etherscan.io/tx/${contract.deployTransaction.hash}`);

				// Waiting for the transaction to be mined
				return contract.deployTransaction.wait();
			})
			.then(() => {
				// The contract is now deployed on chain!
				console.log(`Contract deployed at ${contract.address}`);
				resolve(contract.address)
			})
			.catch( err => {
				reject(err);
			})
	});
}

function _signTransaction(_contract, _encodedABI, _account, _gas) {

    return _account.signTransaction({
        data: _encodedABI,
        from: _account.address,
        gas: _gas,
        to: _contract.options.address,
    })
    .then(signedTx => {
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    })
    .then(res => {
        return res
    })
    .catch(err => {
        console.error("An error occured while calling a payable func:", err);
        return false;
    });
}


function create_software(software_handler_adr, name, version, license_time_default=0, software_admin=account.address) {

	const contract_sh = new web3.eth.Contract(JSON.parse(fs.readFileSync('../SoftwareHandler_abi.json').toString()), software_handler_adr);
	const tx_call = contract_sh.methods.addSoftware(name, version, license_time_default, software_admin);

	return tx_call.estimateGas({from:account.address})
		.then(gas => {
			return _signTransaction(contract_sh, tx_call.encodeABI(), account, gas);
		})
		.then(res => {
			return contract_sh.methods.getNbOfSoftware().call();
		})
		.then(nb => {
			return contract_sh.methods.softwares(nb-1).call()
		})
		.catch(err => {
			console.error(err);
			return false;
		})
}

function create_license(software_adr, admin=account.address, owner=account.address, expiration_timestamp=0, from_account=account) {

	const contract_s = new web3.eth.Contract(JSON.parse(fs.readFileSync('../Software_abi.json').toString()), software_adr);
	const tx_call = contract_s.methods.add_license(admin, owner, expiration_timestamp);

	return tx_call.estimateGas({from:from_account.address})
		.then(gas => {
			return _signTransaction(contract_s, tx_call.encodeABI(), from_account, gas);
		})
		.then(res => {
			return contract_s.methods.get_nb_license().call();
		})
		.then(nb => {
			return contract_s.methods.licenses(nb-1).call()
		})
		.catch(err => {
			console.error(err);
			return false;
		})
}

function set_license_for_sale(license_adr, price=5000000000000000, from_account=account) {

	const contract_l = new web3.eth.Contract(JSON.parse(fs.readFileSync('../License_abi.json').toString()), license_adr);
	const tx_call = contract_l.methods.set_for_sale(price);

	return tx_call.estimateGas({from:from_account.address})
		.then(gas => {
			return _signTransaction(contract_l, tx_call.encodeABI(), from_account, gas);
		})
		.catch(err => {
			console.error(err);
			return false;
		})
}

async function main_minimal () {
	console.log("## compiling contract...");
	await compile_contracts();
	console.log("Successfully compiled contract(s)\n")

	console.log("## creating SoftwareHandler...");
	var software_handler_adr = await deploy_contract();
	console.log("successfully created: " + software_handler_adr + "\n");

	console.log("## creating Software." + (++c) + ".");
	software_adr.push(await create_software(software_handler_adr, "SoftwareName", "1.0.0", 0, account.address));
	console.log("successfully created: " + software_adr + "\n");

	console.log("## creating License 1...");
	var license_1_adr = await create_license(software_adr, account.address, account.address, 0);
	console.log("successfully created: " + license_1_adr + "\n");

	console.log("## creating License 2...");
	var license_2_adr = await create_license(software_adr, account.address, account.address, 0);
	console.log("successfully created: " + license_2_adr + "\n");

	console.log("## setting License 2 for sale");
	await set_license_for_sale(license_2_adr, price=5000000000000000);
	console.log("successfully set for sale !")

	console.log ("all done...")
}

async function main_full_tree () {

// CONTRACT COMPILATION

	// console.log("## compiling contract...");
	// await compile_contracts();
	// console.log("Successfully compiled contract(s)\n")



// SOFTWARE HANDLER CREATION

	console.log("## creating SoftwareHandler...");
	var software_handler_adr = await deploy_contract();
	console.log("successfully created: " + software_handler_adr + "\n");



// SOFTWARES CREATION (Random software names, not linked to the reality !!)
	c = 0;
	software_adr = []

	console.log("## creating Software " + (++c) + "...");
	software_adr.push(await create_software(software_handler_adr, "Adobe Photoshop", "19.7.5", 0, address_account_1));
	console.log("successfully created: " + software_adr[software_adr.length-1] + "\n");

	console.log("## creating Software " + (++c) + "...");
	software_adr.push(await create_software(software_handler_adr, "Borderlands 4", "4.5.2", 0, address_account_1));
	console.log("successfully created: " + software_adr[software_adr.length-1] + "\n");

	console.log("## creating Software " + (++c) + "...");
	software_adr.push(await create_software(software_handler_adr, "Calculator", "1.0.0", 0, address_account_2));
	console.log("successfully created: " + software_adr[software_adr.length-1] + "\n");

	console.log("## creating Software " + (++c) + "...");
	software_adr.push(await create_software(software_handler_adr, "CyberPunk", "0.0.1", 0, address_account_3));
	console.log("successfully created: " + software_adr[software_adr.length-1] + "\n");

	console.log("## creating Software " + (++c) + "...");
	software_adr.push(await create_software(software_handler_adr, "Visual Studio", "2017 7.7.1.15.4.3.56.35.342756374.wtf", 0, address_account_4));
	console.log("successfully created: " + software_adr[software_adr.length-1] + "\n");

	console.log("## creating Software " + (++c) + "...");
	software_adr.push(await create_software(software_handler_adr, "SolidWorks", "2019 12000.27.00.456", 0, address_account_4));
	console.log("successfully created: " + software_adr[software_adr.length-1] + "\n");



// LICENSE CREATION
	c = 0;
	license_adr = []


	// software 0

	for (let i = 0 ; i < 2 ; i++) {
		console.log("## creating License " + (++c) + "...");
		license_adr.push(await create_license(software_adr[0], address_account_1, address_account_1, 0, account_1))
		console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");
	}


	// software 1

	console.log("## creating License " + (++c) + "...");
	license_adr.push(await create_license(software_adr[1], address_account_1, address_account_2, 0, account_1))
	console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");

	console.log("## creating License " + (++c) + "...");
	license_adr.push(await create_license(software_adr[1], address_account_1, address_account_3, 0, account_1))
	console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");

	console.log("## creating License " + (++c) + "...");
	license_adr.push(await create_license(software_adr[1], address_account_1, address_account_4, 0, account_1))
	console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");


	// software 2

	for (let i = 0 ; i < 10 ; i++) {
		console.log("## creating License " + (++c) + "...");
		license_adr.push(await create_license(software_adr[2], address_account_2, address_account_3, 0, account_2))
		console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");
	}

	for (let i = 0 ; i < 10 ; i++) {
		console.log("## creating License " + (++c) + "...");
		license_adr.push(await create_license(software_adr[2], address_account_2, address_account_4, 0, account_2))
		console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");
	}


	// software 3

	console.log("## creating License " + (++c) + "...");
	license_adr.push(await create_license(software_adr[3], address_account_3, address_account_1, 0, account_3))
	console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");

	console.log("## creating License " + (++c) + "...");
	license_adr.push(await create_license(software_adr[3], address_account_3, address_account_2, 0, account_3))
	console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");

	console.log("## creating License " + (++c) + "...");
	license_adr.push(await create_license(software_adr[3], address_account_3, address_account_3, 0, account_3))
	console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");

	console.log("## creating License " + (++c) + "...");
	license_adr.push(await create_license(software_adr[3], address_account_3, address_account_4, 0, account_3))
	console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");


	// software 4

	for (let i = 0 ; i < 3 ; i++) {
		console.log("## creating License " + (++c) + "...");
		license_adr.push(await create_license(software_adr[4], address_account_4, address_account_2, 0, account_4))
		console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");
	}

	console.log("## creating License " + (++c) + "...");
	license_adr.push(await create_license(software_adr[4], address_account_4, address_account_3, 0, account_4))
	console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");


	// software 5

	for (let i = 0 ; i < 5 ; i++) {
		console.log("## creating License " + (++c) + "...");
		license_adr.push(await create_license(software_adr[5], address_account_4, address_account_1, 0, account_4))
		console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");
	}

	for (let i = 0 ; i < 4 ; i++) {
		console.log("## creating License " + (++c) + "...");
		license_adr.push(await create_license(software_adr[5], address_account_4, address_account_2, 0, account_4))
		console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");
	}

	for (let i = 0 ; i < 3 ; i++) {
		console.log("## creating License " + (++c) + "...");
		license_adr.push(await create_license(software_adr[5], address_account_4, address_account_3, 0, account_4))
		console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");
	}

	for (let i = 0 ; i < 2 ; i++) {
		console.log("## creating License " + (++c) + "...");
		license_adr.push(await create_license(software_adr[5], address_account_4, address_account_4, 0, account_4))
		console.log("successfully created: " + license_adr[license_adr.length-1] + "\n");
	}



// LICENSE SET FOR SALE
	c = 0;
	to_put_4_sale = [
		// s 0
		{owner: account_1, price: 5000000000000000, index: 1},

		// s 1
		{owner: account_4, price: 5000000000000000, index: 4},

		// s 2
		{owner: account_3, price: 5000000000000000, index: 6},
		{owner: account_3, price: 5100000000000000, index: 7},
		{owner: account_3, price: 5200000000000000, index: 8},
		{owner: account_3, price: 5300000000000000, index: 9},
		{owner: account_3, price: 5400000000000000, index: 10},
		{owner: account_3, price: 5500000000000000, index: 11},
		{owner: account_3, price: 5600000000000000, index: 12},
		{owner: account_3, price: 5700000000000000, index: 13},
		{owner: account_3, price: 5800000000000000, index: 14},
		{owner: account_4, price: 5900000000000000, index: 20},
		{owner: account_4, price: 6000000000000000, index: 21},
		{owner: account_4, price: 6100000000000000, index: 22},
		{owner: account_4, price: 6200000000000000, index: 23},
		{owner: account_4, price: 6300000000000000, index: 24},
		
		// s 3
		{owner: account_2, price: 5000000000000000, index: 26},
		{owner: account_4, price: 5100000000000000, index: 28},
		
		// s 4
		{owner: account_2, price: 5000000000000000, index: 30},
		{owner: account_2, price: 5100000000000000, index: 31},
		{owner: account_3, price: 5200000000000000, index: 32},
		
		// s5
		{owner: account_1, price: 5000000000000000, index: 37},
		{owner: account_2, price: 5100000000000000, index: 39},
		{owner: account_2, price: 5200000000000000, index: 40},
		{owner: account_2, price: 5300000000000000, index: 41},
		{owner: account_3, price: 5400000000000000, index: 44},
	];

	for (let el of to_put_4_sale) {
		console.log("## setting License " + el.index + " for sale");
		await set_license_for_sale(license_adr[el.index], el.price, el.owner);
		console.log("successfully set for sale !")
	}

	console.log ("all done...")
}

(async function main() {
	
	try {
		// await main_minimal();
		await main_full_tree();
	}
	catch (err) {
		console.error(err);
	}

	process.exit();

})()
