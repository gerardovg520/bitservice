const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');
const bitservice = require('./src/bitservice.js');

const ECPAIR_FILE = './resources/ecpair.json';
const fixtures = require(ECPAIR_FILE);

function getKey(name){
	return fixtures.keys.filter((element) => element.name === name )[0];
};

function createAndSaveAddress(){
	var network = bitcoin.networks.testnet;
	var keyPair = bitcoin.ECPair.makeRandom({network: network});
	var address = keyPair.getAddress();
	var wif = keyPair.toWIF();

	console.log('Address: ' + address);
	console.log('WIF: ' + wif);

	fixtures.keys.push({
			"name": "principal",
			"network": "testnet",
			"address": address,
			"WIF": wif
		});


	fs.writeFile(ECPAIR_FILE, JSON.stringify(fixtures), (err) => {
  		if (err) throw err;
  		console.log('It\'s saved!');
	});
}

function loadFromJSON(){
	var network = bitcoin.networks.testnet;

	fixtures.keys.forEach(function(f){
		console.log('Key Address: ' + f.address);
		console.log('Key WIF: ' + f.WIF);
		var keyPair = bitcoin.ECPair.fromWIF(f.WIF, network);

		console.log('Public Key Buffer: ' + keyPair.getPublicKeyBuffer());

	});
	
}

function getAddressDetail(){
	const key = bitservice.getKeyFromWallet('master');
	bitservice.getAddressDetail(key.address, function(data){
		console.log('Data for address [' + key.address + ']');
		console.log(data);
	});
}

function getTransaction(){
	const tx = '27de729148afc922efc1a567c0cf42f831a433e7b75a97365944d27907de2279';
	bitservice.getTransaction(tx, function(data){
		console.log('Data for tx [' + tx + ']');
		console.log(data);
	});	
}

function createAndSendRawTx(){
	const keySource = getKey('master');
	const keyDest = getKey('second');
	
	const unspents = [
		{
		'txId': '27de729148afc922efc1a567c0cf42f831a433e7b75a97365944d27907de2279',
		'vout': 0,
		'scriptPubKey': new Buffer('76a91469468f8989a337513f75ce69832e99845b5567af88ac', 'hex')
		}
	];

	const destination = [
		{
			'toAddress': keyDest.address,
			'amount': 90000
		}
	];

	const txHex = bitservice.createRawTx(keySource.WIF, unspents, destination, 'Globant Lab GVG');

	bitservice.sendRawTransaction(txHex, function(data){
		console.log('Response: ' + data);
	});
}

//createAndSaveAddress();
//loadFromJSON();
//getAddressDetail();
//getTransaction();
createAndSendRawTx();


/*
Address: ms8BP6ybzxTeHWUKKkuFKPW6K5hvW2mkz4
WIF: cTQWUR4kyWntHrYPAz7JD1qNebAvNyy5Jn77WZMkXNDYkRTAJ3mg
*/

/*
49
3046022100b999de2e23127ec2edf16e2f267b4c2df57b9766059369cee85cbc0a41be688
2022100d09c405f825eec986ca2bf6f35d1267ad7d595042fca4b4f7af3f9adfea68d3301

41
040bf69616981e5970c992a0762f441abcadfed9fc4630fa5e1b82ab00e81d169
05d3820e073e1bd4a9dcfed336f4bf25edc634c2e174989767d299748359c2daf
*/

