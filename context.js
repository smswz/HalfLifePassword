var passwordMenuId;

function contextFunction(info, tab) {
	chrome.tabs.sendRequest(tab.id, {}, function(response){
		selectedElement = response.dom_element;
		console.log(selectedElement);
	});
};

chrome.extension.onConnect.addListener(function(port) {
	console.assert(port.name === "passhalf");
	port.onMessage.addListener(handleMessages);
});

function handleMessages(msg) {
	if(msg.password == true) {
		passwordMenuId = chrome.contextMenus.create(
			{"title": "Setup a half-life password",
			 "contexts": ["all"],
			 "onclick": contextFunction});
		console.log(msg.passId + " " + msg.formId);
	} else if(passwordMenuId) {
		chrome.contextMenus.remove(passwordMenuId);
		passwordMenuId = null;
	} 
}


