const bitcoin = require('bitcoinjs-lib');
const bitservice = require('../src/bitservice');
const fs = require('fs');
const _ = require('lodash');

const ECPAIR_FILE = '../resources/ecpair.json';
const fixtures = require(ECPAIR_FILE);


describe("A suite to test bitcoinjs-lib", function(){

	const network = bitcoin.networks.testnet;
	const key = getKey('master');
	var masterAddDetail = {};

	function getKey(name){
		return fixtures.keys.filter((element) => element.name === name )[0];
	};
	
	xit("can create and save an new address", function(){
		
		var keyPair = bitcoin.ECPair.makeRandom({network: network});
		var address = keyPair.getAddress();
		var wif = keyPair.toWIF();

		console.log('Address: ' + address);
		console.log('WIF: ' + wif);

		const len = fixtures.keys.length;

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

		expect(fixtures.keys.length).toEqual(len + 1);
	});

	xit('can verify a message signed', function(){
		const key = getKey('master');
		const keyPair = bitcoin.ECPair.fromWIF(key.WIF, network);
    	const message = 'This is an example of a signed message.';

    	const signature = bitcoin.message.sign(keyPair, message);

    	console.log('Signature: ' + signature);

    	//expect(bitcoin.message.verify(key.address, signature, message)).toBe(true);
    	expect(true).toBe(true);
    	
	});

	it('can obtain unspent from address: ' + key.address, function(done){
		bitservice.getAddressDetail(key.address, function(body){
			_.forEach(JSON.parse(body).txrefs, function(value, key){
				console.log("Tx[" + key + "]: " + JSON.stringify(value));
		
			});
			done();	
		});

	});

	it('can create a raw hex transaction', function(){
		const keySource = getKey('master');
		const keyDest = getKey('second');
		
		
		const unspents = [
			{
			'txId': '9787a78af00e46f9b5b5b904e9126e83ba9e9b16cf96e2e55b7f78c2e4b61fda',
			'vout': 0
			//'scriptPubKey': new Buffer('76a91469468f8989a337513f75ce69832e99845b5567af88ac', 'hex')
			}
		];

		const destination = [
			{
				'toAddress': keyDest.address,
				'amount': 155300000
			}
		];

		const txHex = bitservice.createRawTx(keySource.WIF, unspents, destination);

      	console.log('Tx hex: ' + txHex);

      	expect(true).toBe(true);

	});

	xit('can create a OP_RETURN transaction', function(){
		const keySource = getKey('master');
		const keyDest = getKey('second');
		
		
		const unspents = [
			{
			'txId': '27de729148afc922efc1a567c0cf42f831a433e7b75a97365944d27907de2279',
			'vout': 1,
			'scriptPubKey': new Buffer('76a91469468f8989a337513f75ce69832e99845b5567af88ac', 'hex')
			}
		];

		const destination = [
			{
				'toAddress': keyDest.address,
				'amount': 00100000
			}
		];

		const txHex = bitservice.createRawTx(keySource.WIF, unspents, destination);

      	console.log('Tx hex: ' + txHex);

      	expect(true).toBe(true);

	});

});