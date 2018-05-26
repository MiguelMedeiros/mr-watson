
function getLedger(){
	$.get("/getLedger", function(data){
		if(data !== "[]"){
			var ledger = JSON.parse(data);

			var tab = document.createElement('table');
			tab.className = "table table-sm";

			var thead = document.createElement('thead');
			var tr = document.createElement('tr');
			tr.className = "gray";

			// Ledger ID
			var td = document.createElement('td');
			var tn = document.createTextNode("Ledger ID");
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
				var maxRows = ledger.LedgerListGrp.length;
				for (var row = 0; row < maxRows; row++){

					tr = document.createElement('tr');

					td = document.createElement('td');
					tn = document.createTextNode(ledger.LedgerListGrp[row].LedgerID);
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					if(ledger.LedgerListGrp[row].Currency === "BTC"){
						tn = document.createTextNode(parseFloat(ledger.LedgerListGrp[row].Amount/1e8).toFixed(6)+" "+ledger.LedgerListGrp[row].Currency);
					}else{
						tn = document.createTextNode(window.numberToReal(ledger.LedgerListGrp[row].Amount/1e8)+" "+ledger.LedgerListGrp[row].Currency);
					}
					td.appendChild(tn);
					tr.appendChild(td);

					td = document.createElement('td');
					tn = document.createTextNode(window.switchLedger(ledger.LedgerListGrp[row].Description));
					td.appendChild(tn);
					tr.appendChild(td);

					tab.appendChild(tr);
				}
			}
			$("#ledger").html(tab);
		}
	});
}
