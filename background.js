// Declarations
var contentPort, popupPort,
	passFields, formFields,
	passId;

var passfields = [];
var formfields = []
var i = 0;

function contextFunction(info, tab) {
	console.log(passId);
	mod_url = tab.url.match(/(\w*\.\w{2,3})\//)[1];
	console.log(mod_url);
}

function handleContentMessages(msg) {
	if(msg.type === "show"){
		chrome.tabs.getSelected(null, function(t){
			chrome.pageAction.show(t.id);
		});
		passFields = msg.fields;
		formFields = msg.forms;
		console.log(msg.fields);
	}
}

function handlePopupMessages(msg) {
	if(typeof handlePopupMessages.passIndex == 'undefined'){ 
		handlePopupMessages.passIndex = 0;
	}

	if(msg.type !== "init"){
		contentPort.postMessage({"type": "unlight", "id": passId});
	}

	if(msg.type === "wantNext"){
		handlePopupMessages.passIndex = (handlePopupMessages.passIndex + 1) % passFields.length; 
	}

	if(msg.type === "wantPrev"){
		handlePopupMessages.passIndex--;
		if(handlePopupMessages.passIndex < 0){ handlePopupMessages.passIndex = passFields.length - 1}
	}

	if((msg.type === "init") || (msg.type === "wantNext") || (msg.type === "wantPrev")){
		contentPort.postMessage({"type": "highlight", "id": passFields[handlePopupMessages.passIndex]});
		passId = passFields[handlePopupMessages.passIndex];
	}

	if(msg.type === "result"){
		chrome.tabs.getSelected(null, function(tab) {
    		mod_url = tab.url.match(/(\w*\.\w{2,3})\//)[1];
			var storageKey = mod_url.substring(0, mod_url.indexOf(".")) + msg.user;
			console.log(storageKey);
		});
	}

	if((msg.type === "close") || (msg.type === "result")){
		chrome.tabs.getSelected(null, function(tab) {
    		chrome.tabs.update(tab.id, { selected: true });
		});
	}

}


// Scripting
chrome.extension.onConnect.addListener(function(port) {
	if(port.name === "content"){
		contentPort = port;
		port.onMessage.addListener(handleContentMessages);
	} else if(port.name === "popup"){
		popupPort = port;
		port.onMessage.addListener(handlePopupMessages);
	}
});


