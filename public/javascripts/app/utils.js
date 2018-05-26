function calcPrice(side){
    if(side === "buy"){
        if($("#buy-price").val() && $("#buy-amount-BRL").val()){

            $("#buy-amount-BRL").removeClass("error");      
            $("#buy-price").removeClass("error");       
            var buyPrice = $("#buy-price").val();
            var buyAmountBRL = $("#buy-amount-BRL").val();
            if($("#buy-amount-BRL").val() === ""){
                buyAmountBRL = window.totalBalanceAccountBTCAvailable;
            }
            var buyAmountBTC = (buyAmountBRL/buyPrice).toFixed(8);
            $("#buy-amount-BRL").val(buyAmountBRL);
            $("#buy-amount-BTC").val(buyAmountBTC);
        }
    }else{
        if($("#sell-price").val() && $("#sell-amount-BTC").val()){
            $("#sell-amount-BRL").removeClass("error");     
            $("#sell-price").removeClass("error");  
            var sellPrice = $("#sell-price").val();
            var sellAmountBRL = $("#sell-amount-BRL").val();
            var sellAmountBTC = window.totalBalanceAccountBTCAvailable;
            if(sellAmountBRL !== ""){
                sellAmountBTC = (sellAmountBRL/sellPrice).toFixed(8);
            }else{
                sellAmountBRL = (sellAmountBTC*sellPrice).toFixed(2);
            }
            $("#sell-amount-BTC").val(sellAmountBTC);
            $("#sell-amount-BRL").val(sellAmountBRL);
        }
    }
}

// Transform Number to BRL
function numberToReal(number) {
	number = parseFloat(number).toFixed(2).split('.');
	number[0] = "R$ " + number[0].split(/(?=(?:...)*$)/).join('.');
	return number.join(',');
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
    }
}

function switchStatus(s) {
    switch(s) {
        case '0':
        	return "Nova Ordem";
        case '1':
        	return "Parcialmente Cheia";
        case '2':
        	return "Cheia";
        case '4':
        	return "Cancelada";
        case '8':
        	return "Rejeitada";
        case 'A':
        	return "Pendente Nova";
    }
}

var switchOrderRejection = function(s) {
    switch(s) {
        case '0':
            return "Broker / Exchange option";
        case '1':
            return " Unknown symbol";
        case '2':
            return "Exchange closed";
        case '3':
            return "Order exceeds limit";
        case '4':
            return "Too late to enter";
        case '5':
            return "Unknown Order";
        case '6':
            return "Duplicate Order";
        case '7':
            return "Duplicate of a verbally communicated order";
        case '8':
            return "Stale Order";
        case '9':
            return "Trade Along required";
        case '10':
            return "Invalid Investor ID";
        case '11':
            return "Unsupported order characteristic";
        case '12':
            return "Surveillence Option";
    }
};

function force2Digits(number){
	number = ("0" + number).slice(-2);
	return number;
}
