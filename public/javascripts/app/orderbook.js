
function createOrderbookTable(arr, type){
	var totalAmount = 0;
	var tab = document.createElement('table');
	tab.className = "table table-sm";

	var thead = document.createElement('thead');
	var tr = document.createElement('tr');
	tr.className = "gray";
	if(type === 'bids'){

		// coluna somatorio
		var td = document.createElement('td');
		var tn = document.createTextNode("Soma BTC");
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
	if(type === 'bids'){
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
		for (var row = 0; row < maxRows; row++){
			tr = document.createElement('tr');
			var price = 0;
			var openOrder = false;
			if(type === 'bids'){

				// coluna somatório
				totalAmount = totalAmount + arr[row][1];
				td = document.createElement('td');
				tn = document.createTextNode(totalAmount.toFixed(2));
				td.appendChild(tn);
				tr.appendChild(td);

				// coluna quantidade BRL
				td = document.createElement('td');
				tn = document.createTextNode(window.numberToReal(arr[row][0]*arr[row][1]));
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
				tn = document.createTextNode(window.numberToReal(arr[row][0]));
				td.className = "green text-right";
				td.appendChild(tn);
				tr.appendChild(td);
				
			}else{

				//preco
				td = document.createElement('td');
				tn = document.createTextNode(window.numberToReal(arr[row][0]));
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
				tn = document.createTextNode(window.numberToReal(arr[row][0]*arr[row][1]));
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
			if(arr[row][2] === window.clientID){					
				tr.className = "bg-yellow";
			}
			tab.appendChild(tr);
		}
		if(type === 'bids'){
			$("#ordebook-bids").html(tab);
		}else{
			$("#ordebook-asks").html(tab);
		}
	}
}

function getOrderBook(){
	$.get("/getOrderBook", function(data){
		if(data !== "[]"){
			var orderbook = JSON.parse(data);
			createOrderbookTable(orderbook.bids, 'bids');
			createOrderbookTable(orderbook.asks, 'asks');
		}
	}).always(function(data,status) {
		if(status === 'success'){
			$("#ordebook-asks > table").delegate('tr', 'click', function() {
		       	var price = this.firstElementChild.innerText;
		       	price = price.replace('R$ ', '');
		       	price = price.replace('.', '');
		       	price = price.replace(',', '.');
		       	price = parseFloat(price);
	       		$("#sell-price").val(price);
	       		if($("#sell-amount-BTC").val() === ""){
					$("#sell-amount-BTC").val(window.totalBalanceAccountBTCAvailable);
	       		}
	       		window.calcPrice("sell");
		    });
		    $("#ordebook-bids > table").delegate('tr', 'click', function() {
		       	var price = this.lastElementChild.innerText;
		       	price = price.replace('R$ ', '');
		       	price = price.replace('.', '');
		       	price = price.replace(',', '.');
		       	price = parseFloat(price);
				$("#buy-price").val(price);
	       		if($("#buy-amount-BRL").val() === ""){
					$("#buy-amount-BRL").val(window.totalBalanceAccountBRLAvailable);
	       		}
				window.calcPrice("buy");
		    });
		}else{
			console.log("Error orderbook");
		}
	});
}
