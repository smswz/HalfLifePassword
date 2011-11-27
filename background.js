// Declarations
var passwordMenuId, passId;

function contextFunction(info, tab) {
	console.log(passId);
	mod_url = tab.url.match(/(\w*\.\w{2,3})\//)[1];
	console.log(mod_url);
}

function handleMessages(msg) {
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
	}
}

// Scripting
chrome.extension.onConnect.addListener(function(port) {
	console.assert(port.name === "passhalf");
	port.onMessage.addListener(handleMessages);
});


