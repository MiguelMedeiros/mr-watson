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
var botTelegram = new TelegramBot(config.telegramToken, {polling: true});

// Telegram Functions

var listenChat = function(){
	if(config.telegramToken != "" && config.telegramChatId != ""){
		botTelegram.on('message', (msg) => {
			filterAlert(msg.text);
		});
		botTelegram.on('polling_error', (error) => {
			utils.consoleLog("Telegram - Error: "+error.code, "red");  // => 'EFATAL'
		});
	}
}

var sendMessage = function(message){
	if(config.telegramToken != "" && config.telegramChatId != ""){
		botTelegram.sendMessage(config.telegramChatId, message);
	}
}

sendMessage("\n*Mr. Watson* às suas ordens!\nSe precisar de ajuda digite /help");


// Blink Trade Functions
// Start API REST connection
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

// Functions 
var balance = function() {
	try {
		blinktraderest.balance().then(function(balance) {
			if(balance){
				if(balance[config.brokerId]){
					variables.infoBalanceBRL.BRL = balance[config.brokerId].BRL;
					variables.infoBalanceBRL.BTC = balance[config.brokerId].BTC;
					variables.infoBalanceBRL.BTC_locked = balance[config.brokerId].BTC_locked;
					variables.infoBalanceBRL.BRL_locked = balance[config.brokerId].BRL_locked;
				}
				variables.ClientID = balance.ClientID;
				utils.consoleLog("Balance API");
			}
		});
	} catch (err) {
		utils.consoleLog("Balance API Error", 'yellow');
	}
}

var myOrders = function(){
	try {
		blinktraderest.myOrders().then(function(myOrders) {
			variables.orderstemp = myOrders['OrdListGrp']
			utils.consoleLog("Orders API");
		});
	} catch (err) {
		utils.consoleLog("Orders API Error", 'yellow');
	}
}

var requestLedger = function(){
	try {
		blinktraderest.requestLedger().then(function(ledger) {
			if (typeof ledger['LedgerListGrp'][0] == 'undefined') {
				return undefined;
			} else {
				variables.ledgertemp = ledger;
			}
			utils.consoleLog("Ledger API");
		});
	} catch (e) {
		utils.consoleLog("Ledger GET Error", 'yellow');
	}
}

var orderbook = function(){
	try {
		blinktraderest.orderbook({
			"limit": 100
		}).then(function(orderbook) {
			if(orderbook){
				variables.orderbooktemp = orderbook;
				utils.consoleLog("Orderbook API");
			}
		})
	} catch (e) {
		utils.consoleLog("Orderbook Error", 'yellow');
	}
}

var ticker = function(){
	try {
		blinktraderest.ticker().then(function(ticker) {
			if(ticker){
				variables.Ticker = [{
					SellVolume: ticker.vol,
					LowPx: ticker.low,
					LastPx: ticker.last,
					BestAsk: ticker.buy,
					HighPx: ticker.high,
					BuyVolume: ticker.vol_brl,
					BestBid: ticker.sell,
					Symbol: "BTCBRL"
				}];
				if((ticker.high == ticker.last) && (ticker.high > variables.tickerHigh)){
					variables.tickerHigh = ticker.last;
					var message = "\n***** Alta do dia *****\nPreço: "+ticker.last+"\n*************************";
					sendMessage(message);
				}
				if((ticker.low == ticker.last) && (ticker.low < variables.tickerLow)){
					variables.tickerLow = ticker.last;
					var message = "\n***** Baixa do dia *****\nPreço: "+ticker.last+"\n*************************";
					sendMessage(message);
				}
				utils.consoleLog("Ticker API");
			}
		});
	} catch (e) {
		utils.consoleLog("Ticker API Error", 'yellow');
	}
}

var tradeHistory = function(){
	try {
		blinktrade.tradeHistory({
		  	"PageSize": 100,
		  	"Page": 0
		}).then(function(trades) {
			utils.consoleLog("Trades WebSocket");
			if(trades){
				variables.Trades = trades['TradeHistoryGrp']['BTCBRL'];
			}
		});
	} catch (e) {
		utils.consoleLog("Trades History Error", 'yellow');
	}
}

var heartbeat = function(){
	try {
		blinktrade.heartbeat().then(function(heartbeat) {
			variables.Latency = heartbeat.Latency;
			utils.consoleLog("Heartbeat WebSocket");
		});
	} catch (e) {
		utils.consoleLog("Heartbeat Error", 'yellow');
	}
}

var postOrder = function(side, price, amount){
	try{
		blinktraderest.sendOrder({
		  	"side": side, // 1 - Buy, 2 - Sell
		  	"price": parseInt((price * 1e8).toFixed(0)),
		  	"amount": parseInt((amount * 1e8).toFixed(0)),
		  	"symbol": "BTCBRL",
		}).then(function(order) {
			utils.consoleLog("Post Order", 'green');
			if(side == 1){
				sideOrder = "Compra";
			}else{
				sideOrder = "Venda";
			}
			var message = "\n*** Ordem Aberta ***\nID: "+order[0].OrderID+"\nTipo: "+sideOrder+"\nPreço: "+utils.numberToReal(order[0].Price/1e8)+"\nQuantidade: "+amount+"\n*************************";
			sendMessage(message);
		});
	} catch(e){
		utils.consoleLog("Post Order Error", 'green');
	}
}

var cancelOrder = function(OrderID, ClOrdID){
	try{
		blinktraderest.cancelOrder({
			orderID: OrderID,
			clientId: ClOrdID
		}).then(function(order) {
			utils.consoleLog("Order Cancelled", 'red');
			var message = "\n*** Ordem Cancelada ***\nID: "+OrderID+"\n************************";
			sendMessage(message);
			var i;
			for (i = 0; i < variables.orderstemp.length; i++) { 
				if(variables.orderstemp[i].OrderID == OrderID){
					variables.orderstemp.splice(i, 1);
				}
			}
		});
	} catch(e){
		utils.consoleLog("Cancel Order Error", 'yellow');
	}
}

var switchLedger = function(s) {
    switch(s) {
        case 'B':
        	return "Bônus";
        case 'D':
        	return "Depósito";
        case 'DF':
        	return "Taxa no depósito (0%)";
        case 'DFC':
        	return "Referência de Taxa de depósito";
        case 'W':
        	return "Saque";
        case 'WF':
        	return "Taxa no Saque (2%)";
        case 'WFC':
        	return "Referência da Taxa de Retirada";
        case 'WFR':
        	return "Desconto na Taxa de Retirada";
        case 'WFRV':
        	return "Revertida Taxa de Retirada";
        case 'T':
        	return "Transação";
        case 'TF':
        	return "Taxa na Transação";
        case 'TFC':
        	return "Trade fee referral";
        case 'TFR':
        	return "Trade fee refund";
        case 'P':
        	return "Point";
    	default:
        	return s;
    };
}

var orderExecuted = function(){
	blinktrade.executionReport()
		.on("EXECUTION_REPORT:EXECUTION", function(data) {
			beep();
			utils.consoleLog("Order Executed", 'yellow');
			if(data.Side == 1){
				sideOrder = "Compra";
			}else{
				sideOrder = "Venda";
			}
			var message = "\n*** Ordem Executada ***\nID: "+data.OrderID+"\nTipo: "+sideOrder+"\nPreço: "+utils.numberToReal(data.Price/1e8)+"\nQuantidade: "+data.OrderQty+" BTC \n*************************";
			sendMessage(message);
		});
}

var filterAlert = function(message){
	commands = message.split(" ");
	switch(commands[0].toUpperCase()) {
	    case "/HELP":
	    	utils.consoleLog("Telegram - Help", "yellow");
	    	helpMessage = "*************************\nMr. Watson - Comandos\n*************************\n";
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
	        totalBalanceAccountBTC = variables.infoBalanceBRL.BTC;
			totalBalanceAccountBRLAvailable = variables.infoBalanceBRL.BRL - variables.infoBalanceBRL.BRL_locked;
			totalBalanceAccountBTCAvailable = variables.infoBalanceBRL.BTC - variables.infoBalanceBRL.BTC_locked;
			totalBalanceBRL = variables.infoBalanceBRL.BRL + variables.infoBalanceBRL.BRL_locked;
			totalBalanceBTC = (variables.infoBalanceBRL.BTC/1e8) * variables.Ticker[0].LastPx;
			totalBalance = (totalBalanceBRL/1e8) + totalBalanceBTC;

	    	balanceMessage = "*************************\nBalanço\n*************************\n";
	    	balanceMessage = balanceMessage +"Saldo Total: " + utils.numberToReal(totalBalance) + "\n";
	    	balanceMessage = balanceMessage +"Saldo BTC: " + (variables.infoBalanceBRL.BTC/1e8).toFixed(6) + " BTC\n";
	    	balanceMessage = balanceMessage +"Saldo BRL: " + utils.numberToReal(totalBalanceBRL/1e8) + "\n";
	    	balanceMessage = balanceMessage +"Saldo travado em venda: " + variables.infoBalanceBRL.BTC_locked.toFixed(6) + " BTC\n";
	    	balanceMessage = balanceMessage +"Saldo travado em compra: " + utils.numberToReal(variables.infoBalanceBRL.BRL_locked) + "\n";
	    	sendMessage(balanceMessage);
	        break;
	    case "/TICKER":
	    	utils.consoleLog("Telegram - Ticker", "yellow");
	    	tickerMessage = "*************************\nTICKER\n*************************\n";
	    	tickerMessage = tickerMessage + "Última Ordem Efetuada: " + utils.numberToReal(variables.Ticker[0].LastPx)+"\n";
	    	tickerMessage = tickerMessage + "Última Ordem de Compra: " + utils.numberToReal(variables.Ticker[0].BestAsk)+"\n";
	    	tickerMessage = tickerMessage + "Última Ordem de Venda: " + utils.numberToReal(variables.Ticker[0].BestBid)+"\n";
	    	tickerMessage = tickerMessage + "Spread Atual: " + utils.numberToReal(variables.Ticker[0].BestBid-variables.Ticker[0].BestAsk)+"\n\n";
	    	tickerMessage = tickerMessage + "Alta 24h: " + utils.numberToReal(variables.Ticker[0].HighPx)+"\n";
	    	tickerMessage = tickerMessage + "Baixa 24h: " + utils.numberToReal(variables.Ticker[0].LowPx)+"\n";
	    	tickerMessage = tickerMessage + "Spread 24h: " + utils.numberToReal(variables.Ticker[0].HighPx-variables.Ticker[0].LowPx)+"\n\n";
	    	tickerMessage = tickerMessage + "Volume 24h (BTC): " + variables.Ticker[0].SellVolume.toFixed(2)+" BTC\n";
	    	tickerMessage = tickerMessage + "Volume 24h (BRL): " + utils.numberToReal(variables.Ticker[0].BuyVolume)+"\n";
	        sendMessage(tickerMessage);
	        break;
	    case "/BUY":
	    	utils.consoleLog("Telegram - Buy", "yellow");
	    	if(commands[1] && commands[2]){
		    	buyPrice = commands[2];
		    	buyAmountBRL = commands[1];
				buyAmountBTC = (buyAmountBRL/buyPrice).toFixed(8);
		    	postOrder ("1", buyPrice, buyAmountBTC);
		    }else{
	    		sendMessage("Comando inválido, tente novamente!");
		    }
	        break;
	    case "/SELL":
	    	utils.consoleLog("Telegram - Sell", "yellow");
	    	if(commands[1] && commands[2]){
		    	sellPrice = commands[2];
		    	sellAmountBRL = commands[1];
				sellAmountBTC = (sellAmountBRL/sellPrice).toFixed(8);
		    	postOrder ("2", sellPrice, sellAmountBTC);
	    	}else{
	    		sendMessage("Comando inválido, tente novamente!");
	    	}
	        break;
	    case "/CANCEL":
	    	utils.consoleLog("Telegram - Cancel", "yellow");
	    	if(commands[1]){
		    	orderID = commands[1];
		    	var i;
				for (i = 0; i < variables.orderstemp.length; i++) { 
					if(variables.orderstemp[i].OrderID == orderID){
		    			clientID = variables.orderstemp[i].ClOrdID;
					}
				}
		    	cancelOrder(orderID, clientID);
		    }else{
	    		sendMessage("Comando inválido, tente novamente!");
		    }
	        break;
	    default:
	    	utils.consoleLog("Telegram - Default Message", "yellow");
	    	sendMessage("Me perdoe, senhor!\nNão entendi o que você precisa.\nSe desejar ajuda digite /help");
	        break;
	}
}


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
	switchLedger: switchLedger,
	orderExecuted: orderExecuted,
	listenChat: listenChat,
	sendMessage: sendMessage,
	filterAlert: filterAlert
}
