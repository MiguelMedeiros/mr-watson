function getTrades(){
	$.get("/getTrades", function(data){
		if(data !== "[]"){
			var trades = JSON.parse(data);
			var tab = document.createElement('table');
			tab.className = "table table-sm";
			var maxRows = trades.length;
			$("#last-trades-orders-num").html("("+trades.length+")");
			var sumPrice = 0;
			for (var row = 0; row < maxRows; row++){
				sumPrice = sumPrice + trades[row].Size/1e8*trades[row].Price/1e8;
				var tr = document.createElement('tr');

				var td = document.createElement('td');
				var tradeDate = new Date(trades[row].Created);
				var tn = document.createTextNode(window.force2Digits(tradeDate.getHours())+":"+window.force2Digits(tradeDate.getMinutes())+":"+window.force2Digits(tradeDate.getSeconds()));
				td.appendChild(tn);
				td.className = "gray text-left";
				tr.appendChild(td);

				td = document.createElement('td');
				tn = document.createTextNode(window.numberToReal(trades[row].Size/1e8*trades[row].Price/1e8));
				td.appendChild(tn);
				td.className = "text-right";
				tr.appendChild(td);

				td = document.createElement('td');
				tn = document.createTextNode(parseFloat(trades[row].Size / 1e8).toFixed(4) + " BTC");
				td.appendChild(tn);
				td.className = "text-right";
				tr.appendChild(td);

				td = document.createElement('td');
				tn = document.createTextNode(window.numberToReal(parseFloat(trades[row].Price / 1e8)));
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

			var averagePrice = sumPrice/maxRows;
			$(".last-trades-average-price span").html(window.numberToReal(averagePrice));
			$(".last-trades-volume span").html(window.numberToReal(sumPrice));
		}
	});
}
