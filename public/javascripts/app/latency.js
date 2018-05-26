function getLatency(){
	$.get("/getLatency", function(data){
		if(data !== "[]"){
			$("#balance .latency span").html(data+" ms");
		}
	});
}
