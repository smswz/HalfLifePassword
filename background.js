// Declarations
var contentPort, popupPort,
	passFields, formFields,
	passwordMenuId, passId;

var passfields = [];
var formfields = []
var i = 0;
function contextFunction(info, tab) {
	console.log(passId);
	mod_url = tab.url.match(/(\w*\.\w{2,3})\//)[1];
	console.log(mod_url);
}

function handleContentMessages(msg) {
	if(msg.type === "pass") {
		if((msg.passId != null) && (!passwordMenuId)) {
			passwordMenuId = chrome.contextMenus.create(
				{"title": "Setup a half-life password",
				 "contexts": ["all"],
				 "onclick": contextFunction});
			passId = msg.passId;
			//console.log(msg.passId + " " + msg.formId);
		}
		else if((msg.passId == null) && (passwordMenuId)) {
			chrome.contextMenus.remove(passwordMenuId);
			passwordMenuId = null;
		}
	} // context menu messages
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
	static var passIndex = 0;
	if(msg.type === "wantNext") {
		contentPort.postMessage({"type": "highlight", "id": passFields[++passIndex].id});
	} else if(msg.type === "wantPrev") {
		contentPort.postMessage({"type": "highlight", "id": passFields[--passIndex].id});
	}
	console.log(msg.type);
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


