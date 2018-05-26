var clientID = 0;
var totalBalanceAccountBRL = 0;
var totalBalanceAccountBTC = 0;
var totalBalanceAccountBRLAvailable = 0;
var totalBalanceAccountBTCAvailable = 0;

function getBalance(){
	$.get("/getBalance", function(data){
		if(data){
			var balance = JSON.parse(data);
			if(clientID === 0){
				if(balance.clientID){
					clientID = balance.clientID;
					$("#balance .client-id span").html(balance.clientID);
				}
			}
			totalBalanceAccountBTC = balance.BTC;
			totalBalanceAccountBRLAvailable = balance.BRL - balance.BRL_locked;
			totalBalanceAccountBTCAvailable = balance.BTC - balance.BTC_locked;
			totalBalanceAccountBRL = balance.totalBalanceBRL;
			$(".balance-total span").html(window.numberToReal(totalBalanceAccountBRL));
			$("#balance .balance-btc span").html(totalBalanceAccountBTCAvailable + " BTC");
			$("#balance .balance-brl span").html(window.numberToReal(totalBalanceAccountBRLAvailable));
			$("#balance .balance-locked-btc span").html(window.numberToReal(balance.BRL_locked));
			$("#balance .balance-locked-brl span").html(balance.BTC_locked+ " BTC");
		}
	});
}
