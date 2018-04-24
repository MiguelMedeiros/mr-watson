var express = require('express');
var variables = require('./../variables');
var blinktrade = require('./../components/blinktrade');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', {}); 
});

router.get('/getTicker', function(req, res, next) {
	res.send(JSON.stringify(variables.Ticker));
});

router.get('/getOrders', function(req, res, next){
	res.send(JSON.stringify(variables.orderstemp));
});

router.get('/getOrderBook', function(req, res, next){
	res.send(JSON.stringify(variables.orderbooktemp));
});

router.get('/getLedger', function(req, res, next){
	res.send(JSON.stringify(variables.ledgertemp));
});

router.get('/getLatency', function(req, res, next){
	res.send(JSON.stringify(variables.Latency));
}); 

router.get('/getTrades', function(req, res, next){
	res.send(JSON.stringify(variables.Trades));
}); 

router.get('/getTradesAPI', function(req, res, next){
	res.send(JSON.stringify(variables.TradesAPI));
});

router.get('/getWallets', function(req, res, next){
	res.send(JSON.stringify(variables.wallets));
});

router.post('/postOrder', function(req, res, next){
	var error = false;
	if(req.body.side){
		side = req.body.side;
	}else{
		error = true;
	}
	if(req.body.price){
		price = req.body.price;
	}else{
		error = true;
	}
	if(req.body.amount){
		amount = req.body.amount;
	}else{
		error = true;
	}
	if(error == false){
		blinktrade.postOrder(side, price, amount);
	}
	res.send(error);
});

router.post('/cancelOrder', function(req, res, next){
	var error = false;
	if(req.body.orderID){
		orderID = req.body.orderID;
	}else{
		error = true;
	}
	if(req.body.orderID){
		ClOrdID = req.body.ClOrdID;
	}else{
		error = true;
	}
	if(error == false){
		blinktrade.cancelOrder(orderID,ClOrdID);
	}
	res.send(error);
});

router.get('/getBalance', function(req, res, next){
	var BRL_locked = "";
	var BTC_locked = "";
	if (variables.infoBalanceBRL.BRL_locked > 0) {
		BRL_locked = parseFloat(variables.infoBalanceBRL.BRL_locked / 1e8).toFixed(2);
	}else{
		BRL_locked = 0;
	}
	if (variables.infoBalanceBRL.BTC_locked > 0) {
		BTC_locked = parseFloat(variables.infoBalanceBRL.BTC_locked / 1e8).toFixed(6);
	}else{
		BTC_locked = 0;
	}
	res.send(JSON.stringify({ 
		BRL: parseFloat(variables.infoBalanceBRL.BRL / 1e8).toFixed(2), 
		BTC: parseFloat(variables.infoBalanceBRL.BTC / 1e8).toFixed(6), 
		BRL_locked: BRL_locked, 
		BTC_locked: BTC_locked, 
		ClientID: variables.ClientID }));
}); 

router.get('/getTotalBalance', function(req, res){
	totalBalance = 0;
	if(variables.Ticker[0]){
		totalBalanceBRL = variables.infoBalanceBRL.BRL + variables.infoBalanceBRL.BRL_locked;
		totalBalanceBTC = (variables.infoBalanceBRL.BTC/1e8) * variables.Ticker[0].LastPx;
		totalBalance = (totalBalanceBRL/1e8) + totalBalanceBTC;
	}
    res.send(JSON.stringify(totalBalance));
});

module.exports = router;
