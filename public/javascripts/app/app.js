(function($) {

	var preload = false;
	var preloadBalance = false;
	var preloadTicker = false;
	var preloadOrderBook = false;
	var preloadTrades = false;

	var preloadLoop = window.setInterval(function(){
		if(preload === false){
			if(!preloadBalance){
				$.get("/getBalance", function(data){
					if(data !== "[]"){
						preloadBalance = true;	
						$("#preloadBalance .loading").hide();		
						$("#preloadBalance .loaded").show();
						window.getBalance();
					}
				});
			}

			if(!preloadTicker){
				$.get("/getTicker", function(data){
					if(data !== "[]"){
						preloadTicker = true;	
						$("#preloadTicker .loading").hide();		
						$("#preloadTicker .loaded").show();		
						window.getTicker();
					}
				});
			}

			if(!preloadOrderBook){
				$.get("/getOrderBook", function(data){
					if(data !== "[]"){
						preloadOrderBook = true;	
						$("#preloadOrderBook .loading").hide();		
						$("#preloadOrderBook .loaded").show();	
						window.getOrderBook();
					}
				});
			}

			if(!preloadTrades){
				$.get("/getTrades", function(data){
					if(data !== "[]"){
						preloadTrades = true;	
						$("#preloadTrades .loading").hide();		
						$("#preloadTrades .loaded").show();		
						window.getTrades();
					}
				});
			}
		}
		if(preloadBalance && preloadTicker && preloadOrderBook && preloadTrades){
			// Start Mr. Watson
			$("#preloadOrders .loading").hide();		
			$("#preloadLedger .loading").hide();		
			$("#preloadWallets .loading").hide();		
			$("#preloadOrders .loaded").show();	
			$("#preloadLedger .loaded").show();		
			$("#preloadWallets .loaded").show();	
			
			$('.eye').css("background", "green");
			$('.antena-top').css("background", "green");

			window.getMonitoringSpread();
			window.getOrders();
			window.getLedger();
			window.getWallets();

			window.setTimeout(function(){ 
				preload = true;
				window.clearInterval(preloadLoop);
			}, 500);
		}
	},1000);

	var mainLoop = window.setInterval(function(){
		if(preload === true){
			window.clearInterval(mainLoop);
			$(".preloader").hide();
			$(".main-container").show();

			new window.TradingView.widget({
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
			
			window.getBalance();

			//get information (1 second)
			window.setInterval(function(){
				window.getBalance();
				window.getOrderBook();
				window.getTicker();
				window.getLedger();
				window.getLatency();
				window.getOrders();
				window.getTrades();
				window.getMonitoringSpread();
				window.getWallets();
			},1000);
		}
	},1000);
})(jQuery);
