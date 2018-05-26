
function getMonitoringSpread(){
	if(window.ticker){
		if(window.ticker.lastPx > 0 && window.ticker.bestBid > 0){
			var lastPriceTemp = window.ticker.lastPx;
			var lastBid = window.ticker.bestBid - 0.01; // sell
			var lastAsk = window.ticker.bestAsk + 0.01; // buy
			var spread = lastBid - lastAsk;
			var spreadPorcentage = lastAsk*100/lastBid;
			spreadPorcentage = 100 - spreadPorcentage;
			var spreadPorcentageWithFee = spreadPorcentage-(0.025+0.025); // fees
			var qntyBRL = window.totalBalanceAccountBRLAvailable;
			var lucro = qntyBRL*spreadPorcentageWithFee/100;

			var tab = document.createElement('table');
			tab.className = "table table-sm";

			var thead = document.createElement('thead');
			var tr = document.createElement('tr');
			tr.className = "gray";

			var td = document.createElement('td');
			var tn = document.createTextNode("Quantidade");
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
			tn = document.createTextNode(window.numberToReal(qntyBRL));
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode(window.numberToReal(lastAsk));
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode(window.numberToReal(lastBid));
			td.appendChild(tn);
			tr.appendChild(td);

			td = document.createElement('td');
			tn = document.createTextNode(window.numberToReal(spread));
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
			tn = document.createTextNode(window.numberToReal(lucro));
			td.appendChild(tn);
			if(lucro > 0){
				tr.className = "green";
				$('.eye').css("background", "green");
				$('.antena-top').css("background", "green");
			}else if(lucro === 0){
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
