const bitcoin = require('bitcoinjs-lib');
const request = require('request');

const ECPAIR_FILE = '../resources/ecpair.json';
const fixtures = require(ECPAIR_FILE);

const BLOCKCYPER = 'https://api.blockcypher.com/v1/btc/test3/';


exports.getKeyFromWallet = function(name){
	return fixtures.keys.filter((element) => element.name === name )[0];
}

exports.getAddressDetail = function(address, success){
	const url = BLOCKCYPER + 'addrs/' + address;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
	    	success(body);
	  	}else{
	  		console.log('Error:' + error);
	  		console.log('Response status:' + response.statusCode);
	  	}
	});
}

exports.getTransaction = function(tx, success){
	const url = BLOCKCYPER + 'txs/' + tx;
	request(url, function(error, response, body){
		if(!error && response.statusCode == 200){
			success(body);
		}else{
			console.log('Error:' + error);
			console.log('Response status:' + response.statusCode);
		}
	})
}

exports.createRawTx =  function(WIF, unspents, destination, metadata){
	const network = bitcoin.networks.testnet;
	const keyPair = bitcoin.ECPair.fromWIF(WIF, network);
	const tx = new bitcoin.TransactionBuilder(network);

	debugger;
	//Creating transaction
	unspents.forEach((unspent) => {
		tx.addInput(unspent.txId, unspent.vout, null, unspent.scriptPubKey);	
	});
	
	destination.forEach((destination) => {
		tx.addOutput(destination.toAddress, destination.amount);	
	});
    
    if(metadata){
    	tx.addOutput(bitcoin.script.nullDataOutput(new Buffer(metadata)), 0);
	}

	debugger;
    tx.sign(0, keyPair);
      	
    var txRaw = tx.build();

    return txRaw.toHex();
}

exports.sendRawTransaction = function(txHex, success){
	//curl -d '{"tx":"01000000017922de0779d2445936975ab7e733a431f842cfc067a5c1ef22c9af489172de27000000006a4730440220625d1bb9f78814fac802d2089b82f60bf13caeed87015bbecdd8d2b938675dd902207669952e24e863aa5f8285f2bb8b764ba257bc16c424973232bdefecbff59ac60121036f958376305ce11a8237d3b52920811d8361831f6877a79349de66c8ada3d0f3ffffffff02905f0100000000001976a9141b090c5905e043072c796e4c3bc87974a2802b9b88ac0000000000000000116a0f476c6f62616e74204c61622047564700000000"}' https://api.blockcypher.com/v1/btc/test3/txs/push
	const url = BLOCKCYPER + 'txs/push';
	const pushtx = {
		tx: txHex
	};

	console.log('JSON: ' + JSON.stringify(pushtx));

	request.post(url, JSON.stringify(pushtx), function(error, response, body){
		if(!error && response.statusCode == 200){
			success(body);
		}else{
			console.log('Error:' + error);
			console.log('Response status:' + response.statusMessage);
			console.log('Body: '+ body);
		}
	});
}
