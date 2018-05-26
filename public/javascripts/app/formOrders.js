
function postOrder(side, price, amount){
	var sideTemp = side;
	$.post( "/postOrder", {
		side: side,
		price: price,
		amount: amount
	}).done(function(data) {
		if(data.error === true){
			$(".alert-message").fadeOut();
			$(".error-message").fadeIn();
			$(".error-message").html("Erro ao enviar ordem: "+window.switchOrderRejection(data.order.OrdRejReason));
			window.setTimeout(function(){
				$(".error-message").fadeOut();
			},5000);
		}else{
			$(".alert-message").fadeOut();
			window.getOrderBook();
			window.getOrders();
			if(data.order[0].ExecSide === "1"){
				$("#buy-amount-BRL").val("");
				$("#buy-amount-BTC").val("");
				$("#buy-price").val("");
				$(".success-message").html("Ordem de compra enviada com sucesso!");
			}else{
				$("#sell-amount-BRL").val("");
				$("#sell-amount-BTC").val("");
				$("#sell-price").val("");	
				$(".success-message").html("Ordem de venda enviada com sucesso!");
			}
			$(".success-message").fadeIn();
			window.setTimeout(function(){
				$(".success-message").fadeOut();
			},5000);
		}
	});
}

function cancelOrder(orderID, ClOrdID){
	$(".alert-message").fadeIn();
	$(".alert-message").html("Enviando cancelamento de ordem...");
	$.post( "/cancelOrder", {
		orderID: orderID,
		ClOrdID: ClOrdID
	}).done(function( data ) {
		window.getOrders();
		window.getOrderBook();
		$("#order-id-"+ClOrdID).parent().parent().hide();
		$(".alert-message").fadeIn();
		$(".alert-message").html("Ordem de compra cancelada!");		
		window.setTimeout(function(){
			$(".alert-message").fadeOut();
		},5000);
	});
}

function buyBTC(){
	var amountBRL = $("#buy-amount-BRL").val();
	var amountBTC = $("#buy-amount-BTC").val();
	var price = $("#buy-price").val();
	var error = false;
	var messageError = "";
	
	if(amountBTC < 0.0001){
		error = true;
		$("#buy-amount-BRL").addClass("error");
		$(".error-message").fadeIn();
		messageError = "Valor de ordem mínimo de 0.0001 BTC!<br/>";
	}else{
		$("#buy-amount-BRL").removeClass("error");
	}

	if(amountBTC <= 0){
		error = true;
		$("#buy-amount-BTC").addClass("error");
		messageError = messageError + "Campo de Quantidade BTC obrigatório!<br/>";
	}else{
		$("#buy-amount-BTC").removeClass("error");
	}

	if(price <= 0){
		error = true;
		$("#buy-price").addClass("error");
		messageError = messageError + "Campo de cotação BRL obrigatório!<br/>";
	}else{
		$("#buy-price").removeClass("error");
	}

	if(!error){
		$(".alert-message").fadeIn();
		$(".alert-message").html("Enviando sua ordem de compra...");
		window.postOrder("1", price, amountBTC);
	}else{
		$(".error-message").fadeIn();
		$(".error-message").html(messageError);
		window.setTimeout(function(){
			$(".error-message").fadeOut();
		},5000);
	}
}

function sellBTC(){
	var amountBRL = $("#sell-amount-BRL").val();
	var amountBTC = $("#sell-amount-BTC").val();
	var price = $("#sell-price").val();
	var error = false;
	var messageError = "";

	if(amountBTC < 0.0001){
		error = true;
		$("#sell-amount-BRL").addClass("error");
		$(".error-message").fadeIn();
		messageError = "Valor de ordem mínimo de 0.0001 BTC!<br/>";
	}else{
		$("#sell-amount-BRL").removeClass("error");
	}

	if(amountBTC <= 0){
		error = true;
		$("#sell-amount-BTC").addClass("error");
		messageError = messageError + "Campo de Quantidade BTC obrigatório!<br/>";
	}else{
		$("#sell-amount-BTC").removeClass("error");				
	}

	if(price <= 0){
		error = true;
		$("#sell-price").addClass("error");
		messageError = messageError + "Campo de cotação BRL obrigatório!<br/>";
	}else{
		$("#sell-price").removeClass("error");		
	}

	if(!error){
		$(".alert-message").fadeIn();
		$(".alert-message").html("Enviando sua ordem de venda...");
		window.postOrder("2", price, amountBTC);
	}else{
		$(".error-message").fadeIn();
		$(".error-message").html(messageError);
		window.setTimeout(function(){
			$(".error-message").fadeOut();
		},5000);
	}
}

//form buy/sell
$("#form-buy input").change(function(){
	window.calcPrice("buy");
});
$("#form-sell input").change(function(){
	window.calcPrice("sell");
});
$("#btn-buy").click(function(){
	window.buyBTC();
});
$("#btn-sell").click(function(){
	window.sellBTC();
});
