var clientID = 0;
var lastPrice = 0;
var lastTicker = [];
var averagePrice = 0;
var totalBalanceAccountBRL = 0;
var totalBalanceAccountBTC = 0;
var totalBalanceAccountBRLAvailable = 0;
var totalBalanceAccountBTCAvailable = 0;

(function($) {

	var preload = false;
	var preloadBalance = false;
	var preloadTicker = false;
	var preloadOrders = false;
	var preloadOrderBook = false;
	var preloadTrades = false;
	var preloadWallets = false;
	var preloadLedger = false;

	var preloadLoop = setInterval(function(){
		if(preload == false){
			if(!preloadOrders){
				$.get("/getOrders", function(data){
					if(data != "[]"){
						preloadOrders = true;		
						getOrders();
					}
				});
			}
			if(!preloadBalance){
				$.get("/getBalance", function(data){
					if(data != "[]"){
						preloadBalance = true;	
						$("#preloadBalance .loading").hide();		
						$("#preloadBalance .loaded").show();
						getBalance();
						getTotalBalance();
					}
				});
			}

			if(!preloadTicker){
				$.get("/getTicker", function(data){
					if(data != "[]"){
						preloadTicker = true;	
						$("#preloadTicker .loading").hide();		
						$("#preloadTicker .loaded").show();		
						getTicker();
					}
				});
			}

			if(!preloadOrderBook){
				$.get("/getOrderBook", function(data){
					if(data != "[]"){
						preloadOrderBook = true;	
						$("#preloadOrderBook .loading").hide();		
						$("#preloadOrderBook .loaded").show();	
						getOrderBook();
					}
				});
			}

			if(!preloadOrders){
				$.get("/getOrders", function(data){
					if(data != "[]"){
						preloadOrders = true;	
						$("#preloadOrders .loading").hide();		
						$("#preloadOrders .loaded").show();	
						getOrders();
					}
				});
			}
			if(!preloadLedger){
				$.get("/getLedger", function(data){
					if(data != "[]"){
						preloadLedger = true;	
						$("#preloadLedger .loading").hide();		
						$("#preloadLedger .loaded").show();		
						getLedger();
					}
				});
			}
			if(!preloadWallets){
				$.get("/getWallets", function(data){
					if(data != "[]"){
						preloadWallets = true;	
						$("#preloadWallets .loading").hide();		
						$("#preloadWallets .loaded").show();	
						getWallets();	
					}
				});
			}

			if(!preloadTrades){
				$.get("/getTrades", function(data){
					if(data != "[]"){
						preloadTrades = true;	
						$("#preloadTrades .loading").hide();		
						$("#preloadTrades .loaded").show();		
						getTrades();
					}
				});
			}
		}
		if(preloadOrders == true 
			&& preloadBalance == true 
			&& preloadTicker == true 
			&& preloadOrderBook == true 
			&& preloadOrders == true
			&& preloadLedger == true
			&& preloadWallets == true
			&& preloadTrades == true){
				getMonitoringSpread();
				$('.eye').css("background", "green");
				$('.antena-top').css("background", "green");
				setTimeout(function(){ 
					preload = true;
					clearInterval(preloadLoop);
				}, 500);
		}
	},1000);

	var mainLoop = setInterval(function(){
		if(preload == true){
			clearInterval(mainLoop);
			$(".preloader").hide();
			$(".main-container").show();

			new TradingView.widget({
				"container_id": "tradingview-graph",
				"autosize": true,
				"symbol": "FOXBIT:BTCBRL",
				"interval": "60",
				"timezone": "America/Sao_Paulo",
				"theme": "Dark",
				"style": "1",
				"locale": "br",
				"toolbar_bg": "#f1f3f6",
				"enable_publishing": false,
				"withdateranges": true,
				"hide_side_toolbar": true,
				"hide_top_toolbar": true,
				"allow_symbol_change": false,
				"details": false,
				"save_image": false,
				"studies": [
				"MASimple@tv-basicstudies"
				]
			});

			//set masks
			$("#buy-price").mask('###0.00', {reverse: true});
			$("#buy-amount-BRL").mask('###0.00', {reverse: true});
			$("#buy-amount-BTC").mask("###0.00000000", {reverse: false});
			$("#sell-price").mask('###0.00', {reverse: true});
			$("#sell-amount-BRL").mask('###0.00', {reverse: true});
			$("#sell-amount-BTC").mask("###0.00000000");
			
			getBalance();

			//get information (1 second)
			window.setInterval(function(){
				getBalance();
				getOrderBook();
				getTicker();
				getLedger();
				getLatency();
				getOrders();
				getTrades();
				getTotalBalance();
				getMonitoringSpread();
				getWallets();
			},1000);

			//form buy/sell
			$("#form-buy input").change(function(){
				calcPrice("buy");
			});

			$("#form-sell input").change(function(){
				calcPrice("sell");
			});

			$("#btn-buy").click(function(){
				buyBTC();
			});
			$("#btn-sell").click(function(){
				sellBTC();
			});
		}
	},1000);
})(jQuery)

function getMonitoringSpread(){
	if(lastTicker.length > 0){
		if((lastTicker[0].LastPx > 0) && (lastTicker[0].BestBid > 0)){
			lastPriceTemp = lastTicker[0].LastPx;
			lastBid = lastTicker[0].BestBid - 0.01; // sell
			lastAsk = lastTicker[0].BestAsk + 0.01; // buy
			spread = lastBid - lastAsk;
			spreadPorcentage = 100-(lastAsk*100/lastBid);
			spreadPorcentageWithFee = spreadPorcentage-(0.025+0.025); // fees
			qntyBRL = totalBalanceAccountBRLAvailable;
			lucro = qntyBRL*spreadPorcentageWithFee/100;

			tab = document.createElement('table');
			tab.className = "table table-sm";

			thead = document.createElement('thead');
			tr = document.createElement('tr');
			tr.className = "gray";

			td = document.createElement('td');
			tn = document.createTextNode("Quantidade");
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode("Cotação Compra");
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode("Cotação Venda");
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode("Spread");
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode("Spread");
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode("Spread - Fee");
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode("Lucro");
			td.appendChild(tn);
			tr.appendChild(td);

			thead.appendChild(tr);
			tab.appendChild(thead);

			tr = document.createElement('tr');

			td = document.createElement('td');
			tn = document.createTextNode(numberToReal(qntyBRL));
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode(numberToReal(lastAsk));
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode(numberToReal(lastBid));
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode(numberToReal(spread));
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode(spreadPorcentage.toFixed(3) + " %");
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode(spreadPorcentageWithFee.toFixed(3) + " %");
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode(numberToReal(lucro));
			td.appendChild(tn);
			if(lucro >0){
				tr.className = "green";
				$('.eye').css("background", "green");
				$('.antena-top').css("background", "green");
			}else if(lucro == 0){
				tr.className = "yellow";
				$('.eye').css("background", "black");
				$('.antena-top').css("background", "yellow");
			}else{
				tr.className = "red";
				$('.eye').css("background", "red");
				$('.antena-top').css("background", "red");
			}
			tr.appendChild(td);

			tab.appendChild(tr);
			$("#monitoring-spread").html(tab);
		}
	}
}

function calcPrice(side){
	if(side == "buy"){
		if($("#buy-price").val() && $("#buy-amount-BRL").val()){

			$("#buy-amount-BRL").removeClass("error");		
			$("#buy-price").removeClass("error");		
			buyPrice = $("#buy-price").val();
			if($("#buy-amount-BRL").val() != ""){
				buyAmountBRL = $("#buy-amount-BRL").val();
			}else{
				buyAmountBRL = totalBalanceAccountBTCAvailable;
			}
			buyAmountBTC = (buyAmountBRL/buyPrice).toFixed(8);
			$("#buy-amount-BRL").val(buyAmountBRL);
			$("#buy-amount-BTC").val(buyAmountBTC);
		}
	}else{
		if($("#sell-price").val() && $("#sell-amount-BTC").val()){
			$("#sell-amount-BRL").removeClass("error");		
			$("#sell-price").removeClass("error");	
			sellPrice = $("#sell-price").val();
			if($("#sell-amount-BRL").val() != ""){
				sellAmountBRL = $("#sell-amount-BRL").val();
				sellAmountBTC = (sellAmountBRL/sellPrice).toFixed(8);
			}else{
				sellAmountBTC = totalBalanceAccountBTCAvailable;
				sellAmountBRL = (sellAmountBTC*sellPrice).toFixed(2);
			}
			$("#sell-amount-BTC").val(sellAmountBTC);
			$("#sell-amount-BRL").val(sellAmountBRL);
		}
	}
}

function getOrders(){
	$.get("/getOrders", function(data){
		if(data != "[]"){
			orders = JSON.parse(data);

			tab = document.createElement('table');
			tab.className = "table table-sm";

			thead = document.createElement('thead');
			tr = document.createElement('tr');
			tr.className = "gray";

			// Order ID
			td = document.createElement('td');
			tn = document.createTextNode("Order ID");
			td.appendChild(tn);
			tr.appendChild(td);

			// Tipo
			td = document.createElement('td');
			tn = document.createTextNode("Tipo");
			td.appendChild(tn);
			tr.appendChild(td);

			// Quantidade BRL
			td = document.createElement('td');
			tn = document.createTextNode("Qtd. BRL");
			td.appendChild(tn);
			tr.appendChild(td);

			// Status
			td = document.createElement('td');
			tn = document.createTextNode("Status");
			td.appendChild(tn);
			tr.appendChild(td);

			// Quantidade BTC
			td = document.createElement('td');
			tn = document.createTextNode("Qtd. BTC");
			td.appendChild(tn);
			tr.appendChild(td);

			// Preço
			td = document.createElement('td');
			tn = document.createTextNode("Cotação");
			td.appendChild(tn);
			tr.appendChild(td);

			// Preço
			td = document.createElement('td');
			tn = document.createTextNode("Lucro");
			td.appendChild(tn);
			tr.appendChild(td);

			thead.appendChild(tr);
			tab.appendChild(thead);

			if(orders){
				maxRows = orders.length;
				//maxRows = 50;
				for (row = 0; row < maxRows; row++){

					tr = document.createElement('tr');
					if(orders[row].OrdStatus == "0"){
						tr.className = "yellow";
					}

					td = document.createElement('td');
					tn = document.createTextNode(orders[row].OrderID);
					//td.className = "gray";
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					if(orders[row].Side == "1"){
						tn = document.createTextNode("Compra");
						td.className = "green";
					}else{
						tn = document.createTextNode("Venda");
						td.className = "red";
					}
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					tn = document.createTextNode(numberToReal((orders[row].Price/1e8)*(orders[row].OrderQty/1e8)));
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					if(orders[row].OrdStatus == 0){
						var orderID = orders[row].OrderID;
						var ClOrdID = orders[row].ClOrdID;
						var cancelOrderIDText = 'order-id-'+ClOrdID;
						$('<a>',{
						    text: 'Cancelar',
						    title: 'Cancelar Ordem',
						    href: 'javascript:cancelOrder('+orderID+','+ClOrdID+')',
						    id: cancelOrderIDText
						}).appendTo(td);
					}else{
						tn = document.createTextNode(switchStatus(orders[row].OrdStatus));
						td.appendChild(tn);
					}
					tr.appendChild(td);


					td = document.createElement('td');
					tn = document.createTextNode(orders[row].OrderQty/1e8 + " BTC");
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					tn = document.createTextNode(numberToReal(orders[row].Price/1e8));
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					lucro = (lastPrice*100)/(orders[row].Price/1e8)-100;
					if(orders[row].Side == "2"){
						lucro = lucro*-1;
					}
					tn = document.createTextNode((lucro).toFixed(2) + " %");
					if(lucro >= 0){
						td.className = "green";
					}else{
						td.className = "red";
					}
					td.appendChild(tn);
					tr.appendChild(td);

					tab.appendChild(tr);
				}
			}
			$("#orders").html(tab);
		}
	});
}
function getLatency(){
	$.get("/getLatency", function(data){
		if(data != "[]"){
			$("#balance .latency span").html(data+" ms");
		}
	});
}
function getBalance(){
	$.get("/getBalance", function(data){
		if(data != "[]"){
			balance = JSON.parse(data);
			if(clientID == 0){
				clientID = balance.ClientID;
			}
			totalBalanceAccountBTC = balance.BTC;
			totalBalanceAccountBRLAvailable = balance.BRL - balance.BRL_locked;
			totalBalanceAccountBTCAvailable = balance.BTC - balance.BTC_locked;
			$("#balance .client-id span").html(balance.ClientID);
			$("#balance .balance-btc span").html((balance.BTC-balance.BTC_locked) + " BTC");
			$("#balance .balance-brl span").html(numberToReal(balance.BRL-balance.BRL_locked));
			$("#balance .balance-locked-btc span").html(numberToReal(balance.BRL_locked));
			$("#balance .balance-locked-brl span").html(balance.BTC_locked+ " BTC");
		}
	});
}

function getLedger(){
	$.get("/getLedger", function(data){
		if(data != "[]"){
			ledger = JSON.parse(data);

			tab = document.createElement('table');
			tab.className = "table table-sm";

			thead = document.createElement('thead');
			tr = document.createElement('tr');
			tr.className = "gray";

			// Ledger ID
			td = document.createElement('td');
			tn = document.createTextNode("Ledger ID");
			td.appendChild(tn);
			tr.appendChild(td);

			// Quantidade
			td = document.createElement('td');
			tn = document.createTextNode("Quantidade");
			td.appendChild(tn);
			tr.appendChild(td);

			// Descrição
			td = document.createElement('td');
			tn = document.createTextNode("Descrição");
			td.appendChild(tn);
			tr.appendChild(td);

			thead.appendChild(tr);
			tab.appendChild(thead);

			if(ledger.LedgerListGrp){
				maxRows = ledger.LedgerListGrp.length;
				for (row = 0; row < maxRows; row++){

					tr = document.createElement('tr');

					td= document.createElement('td');
					tn = document.createTextNode(ledger.LedgerListGrp[row].LedgerID);
					td.appendChild(tn);
					tr.appendChild(td);

					td= document.createElement('td');
					if(ledger.LedgerListGrp[row].Currency == "BTC"){
						tn = document.createTextNode(parseFloat(ledger.LedgerListGrp[row].Amount/1e8).toFixed(6)+" "+ledger.LedgerListGrp[row].Currency);
					}else{
						tn = document.createTextNode(numberToReal(ledger.LedgerListGrp[row].Amount/1e8)+" "+ledger.LedgerListGrp[row].Currency);
					}
					td.appendChild(tn);
					tr.appendChild(td);

					td= document.createElement('td');
					tn = document.createTextNode(switchLedger(ledger.LedgerListGrp[row].Description));
					td.appendChild(tn);
					tr.appendChild(td);

					tab.appendChild(tr);
				}
			}
			$("#ledger").html(tab);
		}
	});
}

function getTicker(){
	$.get("/getTicker", function(data){
		if(data != "[]"){
			ticker = JSON.parse(data);
			lastTicker = ticker;
			ticker = ticker[0]; //hack para o rest API json
			lastPrice = ticker.LastPx;
			$(document).attr("title", numberToReal(ticker.LastPx)+" Mr. Watson");
			$("#ticker .sell-volume span").html(ticker.SellVolume.toFixed(2)+" BTC");
			$("#ticker .buy-volume span").html(numberToReal(ticker.BuyVolume));
			$("#ticker .low-px span").html(numberToReal(ticker.LowPx));
			$("#ticker .high-px span").html(numberToReal(ticker.HighPx));
			$("#ticker .last-px span").html(numberToReal(ticker.LastPx));
			$("#ticker .best-ask span").html(numberToReal(ticker.BestAsk));
			$("#ticker .best-bid span").html(numberToReal(ticker.BestBid));
			$("#ticker .spread-live span").html(numberToReal(ticker.BestBid-ticker.BestAsk));
			$("#ticker .spread-day span").html(numberToReal(ticker.HighPx-ticker.LowPx));
		}
	}).always(function(data,status) {
		if(status == 'success'){

		}else{
			console.log("Error Ticker!");
		}
	});
}

function getOrderBook(){
	$.get("/getOrderBook", function(data){
		if(data != "[]"){
			orderbook = JSON.parse(data);
			createOrderbookTable(orderbook.bids, 'bids');
			createOrderbookTable(orderbook.asks, 'asks');
		}
	}).always(function(data,status) {
		if(status == 'success'){
			$("#ordebook-asks > table").delegate('tr', 'click', function() {
		       	var price = this.firstElementChild.innerText;
		       	price = price.replace('R$ ', '');
		       	price = price.replace('.', '');
		       	price = price.replace(',', '.');
		       	price = parseFloat(price);
	       		$("#sell-price").val(price);
	       		if($("#sell-amount-BTC").val() == ""){
					$("#sell-amount-BTC").val(totalBalanceAccountBTCAvailable);
	       		}
	       		calcPrice("sell");
		    });
		    $("#ordebook-bids > table").delegate('tr', 'click', function() {
		       	var price = this.lastElementChild.innerText;
		       	price = price.replace('R$ ', '');
		       	price = price.replace('.', '');
		       	price = price.replace(',', '.');
		       	price = parseFloat(price);
				$("#buy-price").val(price);
	       		if($("#buy-amount-BRL").val() == ""){
					$("#buy-amount-BRL").val(totalBalanceAccountBRLAvailable);
	       		}
				calcPrice("buy");
		    });
		}else{
			console.log("Error orderbook");
		}
	});
}

function getTrades(){
	$.get("/getTrades", function(data){
		if(data != "[]"){
			trades = JSON.parse(data);

			tab = document.createElement('table');
			tab.className = "table table-sm";
			maxRows = trades.length;
			$("#last-trades-orders-num").html("("+trades.length+")");
			sumPrice = 0;
			for (row = 0; row < maxRows; row++){
				sumPrice = sumPrice+ (trades[row].Size / 1e8)*(trades[row].Price / 1e8);
				tr = document.createElement('tr');

				td = document.createElement('td');
				var tradeDate = new Date(trades[row].Created);
				tn = document.createTextNode(force2Digits(tradeDate.getHours())+":"+force2Digits(tradeDate.getMinutes())+":"+force2Digits(tradeDate.getSeconds()));
				td.appendChild(tn);
				td.className = "gray text-left";
				tr.appendChild(td);

				td = document.createElement('td');
				tn = document.createTextNode(numberToReal((trades[row].Size / 1e8)*(trades[row].Price / 1e8)));
				td.appendChild(tn);
				td.className = "text-right";
				tr.appendChild(td);

				td = document.createElement('td');
				tn = document.createTextNode(parseFloat(trades[row].Size / 1e8).toFixed(4) + " BTC");
				td.appendChild(tn);
				td.className = "text-right";
				tr.appendChild(td);

				td = document.createElement('td');
				tn = document.createTextNode(numberToReal(parseFloat(trades[row].Price / 1e8)));
				td.appendChild(tn);
				if(trades[row+1]){
					if(trades[row].Price < trades[row+1].Price){
						td.className = "red text-right";
					}else{
						td.className = "green text-right";
					}
				}else{
					td.className = "green text-right";
				}
				tr.appendChild(td);

				tab.appendChild(tr);
			}
			$("#last-trades").html(tab);

			averagePrice = sumPrice/maxRows;
			$(".last-trades-average-price span").html(numberToReal(averagePrice));
			$(".last-trades-volume span").html(numberToReal(sumPrice));
		}
	});
}


function createOrderbookTable(arr, type){
	var totalAmount = 0;
	tab = document.createElement('table');
	tab.className = "table table-sm";

	thead = document.createElement('thead');
	tr = document.createElement('tr');
	tr.className = "gray";
	if(type == 'bids'){

		// coluna somatorio
		td = document.createElement('td');
		tn = document.createTextNode("Soma BTC");
		td.appendChild(tn);
		tr.appendChild(td);

		// coluna quantidade BRL
		td = document.createElement('td');
		tn = document.createTextNode("Qtd. BRL");
		td.className = "text-right";
		td.appendChild(tn);
		tr.appendChild(td);

		// coluna quantidade BTC
		td = document.createElement('td');
		tn = document.createTextNode("Qtd. BTC");
		td.className = "text-right";
		td.appendChild(tn);
		tr.appendChild(td);

		// coluna preço
		td = document.createElement('td');
		tn = document.createTextNode("Cotação");
		td.className = "text-right";
		td.appendChild(tn);
		tr.appendChild(td);

	}else{

		// coluna preço
		td = document.createElement('td');
		tn = document.createTextNode("Cotação");
		td.appendChild(tn);
		tr.appendChild(td);

		// coluna quantidade BTC
		td = document.createElement('td');
		tn = document.createTextNode("Qtd. BTC");
		td.className = "text-right";
		td.appendChild(tn);
		tr.appendChild(td);

		// coluna quantidade BRL
		td = document.createElement('td');
		tn = document.createTextNode("Qtd. BRL");
		td.className = "text-right";
		td.appendChild(tn);
		tr.appendChild(td);

		// coluna somatorio
		td = document.createElement('td');
		tn = document.createTextNode("Soma BTC");
		td.className = "text-right";
		td.appendChild(tn);
		tr.appendChild(td);
	}


	// coluna comprador / vendedor
	td = document.createElement('td');
	if(type == 'bids'){
		tn = document.createTextNode("Comprador");
	}else{
		tn = document.createTextNode("Vendedor");
	}
	td.appendChild(tn);

	thead.appendChild(tr);
	tab.appendChild(thead);
	if(arr){
		//maxRows = arr.length;
		var maxRows = 100;
		for (row = 0; row < maxRows; row++){
			tr = document.createElement('tr');
			var price = 0;
			var openOrder = false;
			if(type == 'bids'){

				// coluna somatório
				totalAmount = totalAmount + arr[row][1];
				td = document.createElement('td');
				tn = document.createTextNode(totalAmount.toFixed(2));
				td.appendChild(tn);
				tr.appendChild(td);

				// coluna quantidade BRL
				td = document.createElement('td');
				tn = document.createTextNode(numberToReal(arr[row][0]*arr[row][1]));
				td.className = "text-right";
				td.appendChild(tn);
				tr.appendChild(td);

				// coluna quantidade BTC
				td = document.createElement('td');
				tn = document.createTextNode(arr[row][1].toFixed(6));
				td.className = "text-right";
				td.appendChild(tn);
				tr.appendChild(td);

				//preco
				td = document.createElement('td');
				tn = document.createTextNode(numberToReal(arr[row][0]));
				td.className = "green text-right";
				td.appendChild(tn);
				tr.appendChild(td);
				
			}else{

				//preco
				td = document.createElement('td');
				tn = document.createTextNode(numberToReal(arr[row][0]));
				td.className = "red";
				td.appendChild(tn);
				tr.appendChild(td);

				// coluna quantidade BTC
				td = document.createElement('td');
				tn = document.createTextNode(arr[row][1].toFixed(6));
				td.className = "text-right";
				td.appendChild(tn);
				tr.appendChild(td);

				// coluna quantidade BRL
				td = document.createElement('td');
				tn = document.createTextNode(numberToReal(arr[row][0]*arr[row][1]));
				td.className = "text-right";
				td.appendChild(tn);
				tr.appendChild(td);

				// coluna somatório
				totalAmount = totalAmount + arr[row][1];
				td = document.createElement('td');
				tn = document.createTextNode(totalAmount.toFixed(2));
				td.className = "text-right";
				td.appendChild(tn);
				tr.appendChild(td);

			}
			if(arr[row][2] == clientID){					
				tr.className = "bg-yellow";
			}
			tab.appendChild(tr);
		}
		if(type == 'bids'){
			$("#ordebook-bids").html(tab);
		}else{
			$("#ordebook-asks").html(tab);
		}
	}
}

function getTotalBalance(){
	$.get("/getTotalBalance", function(data){
		totalBalanceAccountBRL = data;
		$(".balance-total span").html(numberToReal(data));
	});
}

function getWallets(){
	$.get("/getWallets", function(data){
		if(data != "[]"){
			wallets = JSON.parse(data);
			tab = document.createElement('table');
			tab.className = "table table-sm";

			thead = document.createElement('thead');
			tr = document.createElement('tr');
			tr.className = "gray";

			// Endereço
			td = document.createElement('td');
			tn = document.createTextNode("Endereço");
			td.appendChild(tn);
			tr.appendChild(td);

			// Saldo BTC
			td = document.createElement('td');
			tn = document.createTextNode("Saldo BTC");
			td.appendChild(tn);
			tr.appendChild(td);

			// Saldo BRL
			td = document.createElement('td');
			td.className = "text-right";
			tn = document.createTextNode("Saldo BRL");
			td.appendChild(tn);
			tr.appendChild(td);

			thead.appendChild(tr);
			tab.appendChild(thead);
			var totalBalanceBRL = 0;
			var totalBalanceBTC = 0;

			if(wallets){
				maxRows = wallets.length;
				Object.keys(wallets).forEach(function(key) {
					tr = document.createElement('tr');

					td = document.createElement('td');
					$('<a>',{
					    text: wallets[key].address,
					    title: 'Mais informações sobre essa carteira',
					    href: 'https://www.minhacarteirabitcoin.com.br/?address='+wallets[key].address,
					    target: '_blank'
					}).appendTo(td);
					//tn = document.createTextNode(wallets[key].address);
					//td.appendChild();
					tr.appendChild(td);

					td = document.createElement('td');
					tn = document.createTextNode(parseFloat(wallets[key].balance/1e8).toFixed(6));
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					td.className = "text-right";
					tn = document.createTextNode(numberToReal((wallets[key].balance/1e8)*lastPrice));
					td.appendChild(tn);
					tr.appendChild(td);

					tab.appendChild(tr);
					totalBalanceBRL = totalBalanceBRL + (wallets[key].balance/1e8)*lastPrice;
					totalBalanceBTC = totalBalanceBTC + parseFloat(wallets[key].balance/1e8);
					tab.appendChild(tr);
				});

				tr = document.createElement('tr');
				td = document.createElement('td');
				tn = document.createTextNode("Saldo Total em Cold Storage: ");
				td.appendChild(tn);
				tr.appendChild(td);

				td = document.createElement('td');
				tn = document.createTextNode(totalBalanceBTC.toFixed(6));
				td.appendChild(tn);
				tr.appendChild(td);

				td = document.createElement('td');
				td.className = "text-right";
				tn = document.createTextNode(numberToReal(totalBalanceBRL));
				td.appendChild(tn);
				tr.appendChild(td);
				tr.className = "wallet-balance";
				tab.appendChild(tr);


				tr = document.createElement('tr');
				td = document.createElement('td');
				tn = document.createTextNode("Saldo Total: ");
				td.appendChild(tn);
				tr.appendChild(td);

				td = document.createElement('td');
				tn = document.createTextNode((parseFloat(totalBalanceBTC)+parseFloat(totalBalanceAccountBTC)).toFixed(6));
				td.appendChild(tn);
				tr.appendChild(td);
				tr.className = "yellow";

				td = document.createElement('td');
				td.className = "text-right";
				tn = document.createTextNode(numberToReal(parseFloat(totalBalanceBRL) + parseFloat(totalBalanceAccountBRL)));
				td.appendChild(tn);
				tr.appendChild(td);
				tab.appendChild(tr);
			}
			$("#wallets-table").html(tab);
		}
	});
}

function buyBTC(){
	var amountBRL = $("#buy-amount-BRL").val();
	var amountBTC = $("#buy-amount-BTC").val();
	var price = $("#buy-price").val();
	var error = false;
	
	if(amountBRL < 3){
		error = true;
		$("#buy-amount-BRL").addClass("error");
	}else{
		$("#buy-amount-BRL").removeClass("error");
	}

	if(amountBTC <= 0){
		error = true;
		$("#buy-amount-BTC").addClass("error");
	}else{
		$("#buy-amount-BTC").removeClass("error");
	}

	if(price <= 0){
		error = true;
		$("#buy-price").addClass("error");
	}else{
		$("#buy-price").removeClass("error");
	}

	if(!error){
		postOrder("1", price, amountBTC);
		$("#buy-amount-BRL").val("");
		$("#buy-amount-BTC").val("");
		$("#buy-price").val("");

		$(".success-message").fadeIn();
		$(".success-message").html("Ordem de compra enviada com sucesso!");
		window.setTimeout(function(){
			$(".success-message").fadeOut();
		},5000);

	}else{
		$(".error-message").fadeIn();
		$(".error-message").html("Complete todos os campos para efetuar sua ordem de compra!");
		window.setTimeout(function(){
			$(".error-message").fadeOut();
		},5000);
	}
}

function sellBTC(){
	var amountBRL = $("#sell-amount-BRL").val();
	var amountBTC = $("#sell-amount-BTC").val();
	var price = $("#sell-price").val();
	var error = false;

	if(amountBRL < 3){
		error = true;
		$("#sell-amount-BRL").addClass("error");
	}else{
		$("#sell-amount-BRL").removeClass("error");
	}

	if(amountBTC <= 0){
		error = true;
		$("#sell-amount-BTC").addClass("error");
	}else{
		$("#sell-amount-BTC").removeClass("error");				
	}

	if(price <= 0){
		error = true;
		$("#sell-price").addClass("error");
	}else{
		$("#sell-price").removeClass("error");		
	}

	if(!error){
		postOrder("2", price, amountBTC);
		$("#sell-amount-BRL").val("");
		$("#sell-amount-BTC").val("");
		$("#sell-price").val("");	

		$(".success-message").fadeIn();
		$(".success-message").html("Ordem de venda enviada com sucesso!");
		window.setTimeout(function(){
			$(".success-message").fadeOut();
		},5000);
	}else{
		$(".error-message").fadeIn();
		$(".error-message").html("Complete todos os campos para efetuar sua ordem de venda!");
		window.setTimeout(function(){
			$(".error-message").fadeOut();
		},5000);
	}

}

function postOrder(side, price, amount){
	var sideTemp = side;
	$.post( "/postOrder", {
		side: side,
		price: price,
		amount: amount
	}).done(function( data ) {
		//console.log(data);
	});
}

function cancelOrder(orderID, ClOrdID){
	$.post( "/cancelOrder", {
		orderID: orderID,
		ClOrdID: ClOrdID
	}).done(function( data ) {
		$("#order-id-"+ClOrdID).parent().parent().hide();
		$(".alert-message").fadeIn();
		$(".alert-message").html("Ordem de compra cancelada!");
		window.setTimeout(function(){
			$(".alert-message").fadeOut();
		},5000);
	});
}

// Transform Number to BRL
function numberToReal(numero) {
	var numero = parseFloat(numero).toFixed(2).split('.');
	numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
	return numero.join(',');
}


// switch ledger
function switchLedger(s) {
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
        	return "Referência de Taxa de Transação";
        case 'TFR':
        	return "Reembolso de Taxa de Transação";
        case 'P':
        	return "Point";
    	default:
        	return s;
    };
}

function switchStatus(s) {
    switch(s) {
        case '0':
        	return "Nova Ordem";
        case '1':
        	return "Parcialmente Cheia";
        case '2':
        	return "Cheia"
        case '4':
        	return "Cancelada";
        case '8':
        	return "Rejeitada";
        case 'A':
        	return "Pendente Nova";
    };
}

function force2Digits(number){
	var formattedNumber = ("0" + number).slice(-2);
	return formattedNumber;
}
