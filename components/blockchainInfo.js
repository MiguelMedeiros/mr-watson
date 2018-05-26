var express = require('express');
var request = require('request');
var async = require('async');
var config = require('./../config.json');
var variables = require('./variables');
var utils = require('./utils');

// *********************************************
// Blockchain Info API
// Link: https://blockchain.info/api/
// *********************************************
var wallets = function(){
	try {
		async.forEachOf(config.wallets, (value, key, callback) => {
			request('https://blockchain.info/q/addressbalance/'+value, function (error, response, body) {
				variables.wallets[key] = {
					address: value,
					balance: parseInt(body)
				};
			});
		}, err => {
		    if (err) {
		    	console.error(err.message);
		    }
		});

		if(config.consoleLog){
			utils.consoleLog("Blockchain.Info API");
		}
	} catch (err) {
		utils.consoleLog("Error: "+err, "red");
	}
};

// Export Functions
module.exports = {
	wallets: wallets
};

