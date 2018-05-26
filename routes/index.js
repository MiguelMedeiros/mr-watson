var express = require('express');
var variables = require('./../components/variables');
var blinktrade = require('./../components/blinktrade');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', {}); 
});

router.get('/getBalance', function(req, res, next){
	res.send(JSON.stringify(variables.balance));
}); 

router.get('/getTotalBalance', function(req, res){
    res.send(JSON.stringify(variables.balance.totalBalanceBRL));
});

router.get('/getTicker', function(req, res, next) {
	res.send(JSON.stringify(variables.ticker));
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
	var sendOrderReturn = {
		"error": false,
		"order": null
	};
	if(req.body.side){
		var side = req.body.side;
	}else{
		sendOrderReturn.error = true;
	}
	if(req.body.price){
		var price = req.body.price;
	}else{
		sendOrderReturn.error = true;
	}
	if(req.body.amount){
		var amount = req.body.amount;
	}else{
		sendOrderReturn.error = true;
	}
	if(sendOrderReturn.error === false){
		var promiseOrder = new Promise(function(resolve, reject) {
		  resolve(blinktrade.postOrder(side, price, amount));
		});
		promiseOrder.then(function(value) {
			res.send(value);
		}).catch(function(e) {
			console.log(e);
			res.send(sendOrderReturn);
		});
	}else{
		res.send(sendOrderReturn);
	}
});

router.post('/cancelOrder', function(req, res, next){
	var sendOrderReturn = {
		"error": false,
		"order": null
	};
	if(req.body.orderID){
		var orderID = req.body.orderID;
	}else{
		sendOrderReturn.error = true;
	}
	if(req.body.orderID){
		var ClOrdID = req.body.ClOrdID;
	}else{
		sendOrderReturn.error = true;
	}
	if(sendOrderReturn.error === false){
		var promiseOrder = new Promise(function(resolve, reject) {
		  resolve(blinktrade.cancelOrder(orderID,ClOrdID));
		});
		promiseOrder.then(function(value) {
			res.send(value);
		}).catch(function(e) {
			console.log(e);
			res.send(sendOrderReturn);
		});		
	}
	res.send(sendOrderReturn);
});

module.exports = router;
