var commPort;

function handleMessages(msg) {
	
}

$(function() {
	$("#prev_field").on("click", function(e){
		alert("Gogo");
	});
});

commPort = chrome.extension.connect({"name": "popup"});
commPort.onMessage.addListener(handleMessages);
