// *********************************************
// Blinktrade
// Link: https://blinktrade.com/docs
// *********************************************

var express = require('express');
var config = require('./../config.json');
var variables = require('./../variables');
var utils = require('./utils');

var BlinkTradeWS = require('blinktrade').BlinkTradeWS;
var BlinkTradeRest = require("blinktrade").BlinkTradeRest;

var TelegramBot = require('node-telegram-bot-api');

if(config.telegramToken !== "" && config.telegramChatId !== ""){
	var botTelegram = new TelegramBot(config.telegramToken, {polling: true});
}

var blinktraderest = new BlinkTradeRest({
	prod: true,
	key: config.key,
	secret: config.secret,
	currency: config.currency
});

// Start WebSocket connection
var blinktrade = new BlinkTradeWS({
	prod: true,
	currency: config.currency,
	brokerId: config.brokerId,
});

blinktrade.connect().then(function() {
	return blinktrade.login({
		username: config.key,
		password: config.password
	});
});

var sendMessage = function(message){
	if(config.telegramToken !== "" && config.telegramChatId !== ""){
		botTelegram.sendMessage(config.telegramChatId, message);
	}
};

sendMessage("\n*Mr. Watson* às suas ordens!\nSe precisar de ajuda digite /help");

var postOrder = function(side, price, amount){
	var sendOrderReturn = {
		"error": false,
		"order": null
	};
	try{
		return blinktraderest.sendOrder({
		  	"side": side, // 1 - Buy, 2 - Sell
		  	"price": parseInt((price * 1e8).toFixed(0)),
		  	"amount": parseInt((amount * 1e8).toFixed(0)),
		  	"symbol": "BTCBRL",
		}).then(function(order) {
			if(typeof order  !== "undefined"){
				sendOrderReturn.order = order;
				if(order.OrderID === null){
					sendOrderReturn.error = true;
					utils.consoleLog("Post Order: "+utils.switchOrderRejection(order.OrdRejReason), 'red');
				}else if(order[0] !== null){
					sendOrderReturn.error = false;
					var sideOrder = "Venda";
					if(side === 1){
						sideOrder = "Compra";
					}
					var message = "\n*** Ordem Aberta ***\nID: "+order[0].OrderID+"\nTipo: "+sideOrder+"\nPreço: "+utils.numberToReal(order[0].Price/1e8)+"\nQuantidade: "+amount+"\n*************************";
					sendMessage(message);
					utils.consoleLog("Post Order", 'green');
				}else{
					sendOrderReturn.error = true;
					utils.consoleLog("Post Order: Error ", 'red');
				}
			}
			orderbook();
			myOrders();
			return sendOrderReturn;
		});
	} catch(e){
		utils.consoleLog("Post Order Error", 'green');
		return sendOrderReturn;
	}
};

var cancelOrder = function(OrderID, ClOrdID){
	var sendOrderReturn = {
		"error": true,
		"order": null
	};
	try{
		return blinktraderest.cancelOrder({
			orderID: OrderID,
			clientId: ClOrdID
		}).then(function(order) {
			sendOrderReturn.order = order;
			sendOrderReturn.error = false;
			var message = "\n*** Ordem Cancelada ***\nID: "+OrderID+"\n************************";
			sendMessage(message);
			var i;
			for (i = 0; i < variables.orderstemp.length; i++) { 
				if(variables.orderstemp[i].OrderID === OrderID){
					variables.orderstemp.splice(i, 1);
				}
			}
			orderbook();
			myOrders();
			utils.consoleLog("Order Cancelled", 'red');
		});
	} catch(e){
		utils.consoleLog("Cancel Order Error", 'yellow');
		return sendOrderReturn;
	}
};

var filterAlert = function(message){
	var commands = message.split(" ");
	switch(commands[0].toUpperCase()) {
	    case "/HELP":
	    	utils.consoleLog("Telegram - Help", "yellow");
	    	var helpMessage = "*************************\nMr. Watson - Comandos\n*************************\n";
	    	helpMessage = helpMessage + "Ver preço atual:\n/ticker \n\n";
	    	helpMessage = helpMessage + "Ver o saldo:\n/balance\n\n";
	    	helpMessage = helpMessage + "Comprar BTC:\n/buy [Qnt BRL] [Cotação BRL]\n\n";
	    	helpMessage = helpMessage + "Vender BTC:\n/sell [Qnt BRL] [Cotação BRL]\n\n";
	    	helpMessage = helpMessage + "Cancelar Ordem:\n/cancel [Order ID]\n\n";
	    	helpMessage = helpMessage + "Caso precise de mais informações, acesse o site: https://www.mrwatson.com.br/";
	    	sendMessage(helpMessage);
	        break;
        case "/BALANCE":
        	utils.consoleLog("Telegram - Balance", "yellow");
	        var totalBalanceAccountBTC = variables.balance.BTC;
			var totalBalanceAccountBRLAvailable = variables.balance.BRL - variables.balance.BRL_locked;
			var totalBalanceAccountBTCAvailable = variables.balance.BTC - variables.balance.BTC_locked;
			var totalBalanceBRL = variables.balance.BRL + variables.balance.BRL_locked;
			var totalBalance = variables.balance.BTC * variables.ticker.lastPx + parseFloat(totalBalanceBRL);

	    	var balanceMessage = "*************************\nBalanço\n*************************\n";
	    	balanceMessage = balanceMessage +"Saldo Total: " + utils.numberToReal(totalBalance) + "\n";
	    	balanceMessage = balanceMessage +"Saldo BTC: " + variables.balance.BTC + " BTC\n";
	    	balanceMessage = balanceMessage +"Saldo BRL: " + utils.numberToReal(totalBalanceBRL) + "\n";
	    	balanceMessage = balanceMessage +"Saldo travado em venda: " + variables.balance.BTC_locked + " BTC\n";
	    	balanceMessage = balanceMessage +"Saldo travado em compra: " + utils.numberToReal(variables.balance.BRL_locked) + "\n";
	    	sendMessage(balanceMessage);
	        break;
	    case "/TICKER":
	    	utils.consoleLog("Telegram - Ticker", "yellow");
	    	var tickerMessage = "*************************\nTICKER\n*************************\n";
	    	tickerMessage = tickerMessage + "Última Ordem Efetuada: " + utils.numberToReal(variables.ticker.lastPx)+"\n";
	    	tickerMessage = tickerMessage + "Última Ordem de Compra: " + utils.numberToReal(variables.ticker.bestAsk)+"\n";
	    	tickerMessage = tickerMessage + "Última Ordem de Venda: " + utils.numberToReal(variables.ticker.bestBid)+"\n";
	    	tickerMessage = tickerMessage + "Spread Atual: " + utils.numberToReal(variables.ticker.bestBid-variables.ticker.bestAsk)+"\n\n";
	    	tickerMessage = tickerMessage + "Alta 24h: " + utils.numberToReal(variables.ticker.highPx)+"\n";
	    	tickerMessage = tickerMessage + "Baixa 24h: " + utils.numberToReal(variables.ticker.lowPx)+"\n";
	    	tickerMessage = tickerMessage + "Spread 24h: " + utils.numberToReal(variables.ticker.highPx-variables.ticker.lowPx)+"\n\n";
	    	tickerMessage = tickerMessage + "Volume 24h (BTC): " + variables.ticker.sellVolume.toFixed(2)+" BTC\n";
	    	tickerMessage = tickerMessage + "Volume 24h (BRL): " + utils.numberToReal(variables.ticker.buyVolume)+"\n";
	        sendMessage(tickerMessage);
	        break;
	    case "/BUY":
	    	utils.consoleLog("Telegram - Buy", "yellow");
	    	if(commands[1] && commands[2]){
		    	var buyPrice = commands[2];
		    	var buyAmountBRL = commands[1];
				var buyAmountBTC = (buyAmountBRL/buyPrice).toFixed(8);
		    	postOrder ("1", buyPrice, buyAmountBTC);
		    }else{
	    		sendMessage("Comando inválido, tente novamente!");
		    }
	        break;
	    case "/SELL":
	    	utils.consoleLog("Telegram - Sell", "yellow");
	    	if(commands[1] && commands[2]){
		    	var sellPrice = commands[2];
		    	var sellAmountBRL = commands[1];
				var sellAmountBTC = (sellAmountBRL/sellPrice).toFixed(8);
		    	postOrder ("2", sellPrice, sellAmountBTC);
	    	}else{
	    		sendMessage("Comando inválido, tente novamente!");
	    	}
	        break;
	    case "/CANCEL":
	    	utils.consoleLog("Telegram - Cancel", "yellow");
	    	if(commands[1]){
		    	var orderID = commands[1];
		    	var i;
				for (i = 0; i < variables.orderstemp.length; i++) { 
					if(variables.orderstemp[i].OrderID === orderID){
		    			var clientID = variables.orderstemp[i].ClOrdID;
					}
				}
		    	cancelOrder(orderID, clientID);
		    }else{
	    		sendMessage("Comando inválido, tente novamente!");
		    }
	        break;
	    default:
	    	utils.consoleLog("Telegram - Unknown Message", "yellow");
	    	sendMessage("Me perdoe, senhor!\nNão entendi o que você precisa.\nSe desejar ajuda digite /help");
	        break;
	}
};

var listenChat = function(){
	if(config.telegramToken !== "" && config.telegramChatId !== ""){
		botTelegram.on('message', (msg) => {
			filterAlert(msg.text);
		});
		botTelegram.on('polling_error', (error) => {
			utils.consoleLog("Telegram - Error: "+error.code, "red"); 
		});
	}
};

var balance = function() {
	try {
		blinktraderest.balance().then(function(data) {
			if(data){
				// Client ID
				variables.balance.clientID = data.ClientID;
				if(data[config.brokerId]){
					// balance BRL
					variables.balance.BRL = parseFloat(data[config.brokerId].BRL / 1e8).toFixed(2);
					variables.balance.BRL_locked = parseFloat(data[config.brokerId].BRL_locked / 1e8).toFixed(2);
					
					// balance BTC
					variables.balance.BTC = parseFloat(data[config.brokerId].BTC / 1e8).toFixed(6);
					variables.balance.BTC_locked = parseFloat(data[config.brokerId].BTC_locked / 1e8).toFixed(6);

					// total balance BRL
					variables.balance.totalBalanceBRL = (parseFloat(variables.balance.BRL) + parseFloat(variables.balance.BRL_locked) + (parseFloat(variables.balance.BTC) + parseFloat(variables.balance.BTC_locked)) * parseFloat(variables.ticker.lastPx)).toFixed(2);
				}
				if(config.consoleLog){
					utils.consoleLog("Balance API");
				}
			}
		});
	} catch (err) {
		utils.consoleLog("Balance API Error", 'yellow');
	}
};

var myOrders = function(){
	try {
		blinktraderest.myOrders().then(function(data) {
			variables.orderstemp = data.OrdListGrp;
			if(config.consoleLog){
				utils.consoleLog("Orders API");
			}
		});
	} catch (err) {
		utils.consoleLog("Orders API Error", 'yellow');
	}
};

var requestLedger = function(){
	try {
		blinktraderest.requestLedger().then(function(ledger) {
			if (typeof ledger.LedgerListGrp[0] === 'undefined') {
				return undefined;
			} else {
				variables.ledgertemp = ledger;
			}
			if(config.consoleLog){	
				utils.consoleLog("Ledger API");
			}
		});
	} catch (e) {
		utils.consoleLog("Ledger GET Error", 'yellow');
	}
};

var orderbook = function(){
	try {
		blinktraderest.orderbook({
			"limit": 100
		}).then(function(data) {
			if(data){
				variables.orderbooktemp = data;
				if(config.consoleLog){
					utils.consoleLog("Orderbook API");
				}
			}
		});
	} catch (e) {
		utils.consoleLog("Orderbook Error", 'yellow');
	}
};

var ticker = function(){
	try {
		blinktraderest.ticker().then(function(data) {
			if(data){
				variables.ticker = {
					sellVolume: data.vol,
					buyVolume: data.vol_brl,
					lowPx: data.low,
					lastPx: data.last,
					highPx: data.high,
					bestAsk: data.buy,
					bestBid: data.sell,
					symbol: "BTCBRL"
				};

				// Messaging High and low intra day
				if(data.high === data.last){
					variables.alertHigh = 1;
				}
				if(data.low === data.last){
					variables.alertLow = 1;
				}

				if(config.consoleLog){
					utils.consoleLog("Ticker API");
				}
			}
		});
	} catch (e) {
		utils.consoleLog("Ticker API Error", 'yellow');
	}
};

var alertPrice = function(){
	// Messaging High and low intra day
	var message = "";
	if(variables.alertHigh){
		variables.alertHigh = 0;
		message = "\n***** Alta do dia *****\nPreço: "+utils.numberToReal(variables.ticker.highPx)+"\n*************************";
		sendMessage(message);
		utils.consoleLog("Alert Low Price!", "green");
	}
	if(variables.alertLow){
		variables.alertLow = 0;
		message = "\n***** Baixa do dia *****\nPreço: "+utils.numberToReal(variables.ticker.lowPx)+"\n*************************";
		sendMessage(message);
		utils.consoleLog("Alert Low Price!", "red");
	}	

	if(config.consoleLog){
		utils.consoleLog("Alert Hight/Low Price");
	}
};

var tradeHistory = function(){
	try {
		blinktrade.tradeHistory({
		  	"PageSize": 100,
		  	"Page": 0
		}).then(function(trades) {
			if(trades){
				variables.Trades = trades.TradeHistoryGrp.BTCBRL;
			}

			if(config.consoleLog){
				utils.consoleLog("Trades WebSocket");
			}
		});
	} catch (e) {
		utils.consoleLog("Trades History Error", 'yellow');
	}
};

var heartbeat = function(){
	try {
		blinktrade.heartbeat().then(function(data) {
			variables.Latency = data.Latency;

			if(config.consoleLog){
				utils.consoleLog("Heartbeat WebSocket");
			}
		});
	} catch (e) {
		utils.consoleLog("Heartbeat Error", 'yellow');
	}
};

var orderExecuted = function(){
	blinktrade.executionReport()
		.on("EXECUTION_REPORT:EXECUTION", function(data) {
			utils.beep();
			if(data.Side === 1){
				var sideOrder = "Compra";
			}else{
				sideOrder = "Venda";
			}
			var message = "\n*** Ordem Executada ***\nID: "+data.OrderID+"\nTipo: "+sideOrder+"\nPreço: "+utils.numberToReal(data.Price/1e8)+"\nQuantidade: "+data.OrderQty+" BTC \n*************************";
			sendMessage(message);

			if(config.consoleLog){
				utils.consoleLog("Order Executed", 'yellow');
			}
		});
};

// Export Functions
module.exports = {
	balance: balance,
	myOrders: myOrders,
	requestLedger: requestLedger,
	orderbook: orderbook,
	ticker: ticker,
	tradeHistory: tradeHistory,
	heartbeat: heartbeat,
	postOrder: postOrder,
	cancelOrder: cancelOrder,
	orderExecuted: orderExecuted,
	listenChat: listenChat,
	sendMessage: sendMessage,
	filterAlert: filterAlert,
	alertPrice: alertPrice
};
