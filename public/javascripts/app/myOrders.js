
function getOrders(){
	$.get("/getOrders", function(data){
		if(data !== "[]"){
			var orders = JSON.parse(data);

			var tab = document.createElement('table');
			tab.className = "table table-sm";

			var thead = document.createElement('thead');
			var tr = document.createElement('tr');
			tr.className = "gray";

			// Order ID
			var td = document.createElement('td');
			var tn = document.createTextNode("Order ID");
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
				var maxRows = orders.length;
				//maxRows = 50;
				for (var row = 0; row < maxRows; row++){

					tr = document.createElement('tr');
					if(orders[row].OrdStatus === "0"){
						tr.className = "yellow";
					}

					td = document.createElement('td');
					tn = document.createTextNode(orders[row].OrderID);
					//td.className = "gray";
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					if(orders[row].Side === "1"){
						tn = document.createTextNode("Compra");
						td.className = "green";
					}else{
						tn = document.createTextNode("Venda");
						td.className = "red";
					}
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					tn = document.createTextNode(window.numberToReal(orders[row].Price/1e8*(orders[row].OrderQty/1e8)));
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					if(orders[row].OrdStatus === "0" || orders[row].OrdStatus === "1"){
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
						tn = document.createTextNode(window.switchStatus(orders[row].OrdStatus));
						td.appendChild(tn);
					}
					tr.appendChild(td);


					td = document.createElement('td');
					tn = document.createTextNode(orders[row].OrderQty/1e8 + " BTC");
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					tn = document.createTextNode(window.numberToReal(orders[row].Price/1e8));
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					var lucro = window.ticker.lastPx*100/(orders[row].Price/1e8)-100;
					if(orders[row].Side === "2"){
						lucro = lucro*-1;
					}
					tn = document.createTextNode(lucro.toFixed(2) + " %");
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
