
function getWallets(){
	$.get("/getWallets", function(data){
		if(data !== "[]"){
			var wallets = JSON.parse(data);
			var tab = document.createElement('table');
			tab.className = "table table-sm";

			var thead = document.createElement('thead');
			var tr = document.createElement('tr');
			tr.className = "gray";

			// Endereço
			var td = document.createElement('td');
			var tn = document.createTextNode("Endereço");
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
				var maxRows = wallets.length;
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

					var walletBalanceBTC = wallets[key].balance/1e8;
					
					td = document.createElement('td');
					tn = document.createTextNode(parseFloat(walletBalanceBTC).toFixed(6));
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					td.className = "text-right";
					tn = document.createTextNode(window.numberToReal(walletBalanceBTC*window.ticker.lastPx));
					td.appendChild(tn);
					tr.appendChild(td);

					tab.appendChild(tr);
					totalBalanceBRL = totalBalanceBRL + walletBalanceBTC*window.ticker.lastPx;
					totalBalanceBTC = totalBalanceBTC + parseFloat(walletBalanceBTC);
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
				tn = document.createTextNode(window.numberToReal(totalBalanceBRL));
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
				tn = document.createTextNode((parseFloat(totalBalanceBTC)+parseFloat(window.totalBalanceAccountBTC)).toFixed(6));
				td.appendChild(tn);
				tr.appendChild(td);
				tr.className = "yellow";

				td = document.createElement('td');
				td.className = "text-right";
				tn = document.createTextNode(window.numberToReal(parseFloat(totalBalanceBRL) + parseFloat(window.totalBalanceAccountBRL)));
				td.appendChild(tn);
				tr.appendChild(td);
				tab.appendChild(tr);
			}
			$("#wallets-table").html(tab);
		}
	});
}
