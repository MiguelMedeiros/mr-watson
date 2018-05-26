var ticker = [];

function getTicker(){
	$.get("/getTicker", function(data){
		if(data !== "[]"){
			ticker = JSON.parse(data);
			$(document).attr("title", window.numberToReal(ticker.lastPx)+" Mr. Watson");
			$("#ticker .sell-volume span").html(ticker.sellVolume.toFixed(2)+" BTC");
			$("#ticker .buy-volume span").html(window.numberToReal(ticker.buyVolume));
			$("#ticker .low-px span").html(window.numberToReal(ticker.lowPx));
			$("#ticker .high-px span").html(window.numberToReal(ticker.highPx));
			$("#ticker .last-px span").html(window.numberToReal(ticker.lastPx));
			$("#ticker .best-ask span").html(window.numberToReal(ticker.bestAsk));
			$("#ticker .best-bid span").html(window.numberToReal(ticker.bestBid));
			$("#ticker .spread-live span").html(window.numberToReal(ticker.bestBid-ticker.bestAsk));
			$("#ticker .spread-day span").html(window.numberToReal(ticker.highPx-ticker.lowPx));
		}
	}).always(function(data,status) {
		if(status === 'success'){

		}else{
			console.log("Error Ticker!");
		}
	});
}
