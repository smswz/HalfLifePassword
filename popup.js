var commPort;

function handleMessages(msg) {
	
}

$(function() {
	$("#prev_button").on("click", function(e){
		commPort.postMessage({"type": "wantPrev"});
	});
	$("#next_button").on("click", function(e){
		commPort.postMessage({"type": "wantNext"});
	});
});

commPort = chrome.extension.connect({"name": "popup"});
commPort.onMessage.addListener(handleMessages);
