// Declarations
var passwordMenuId, formId, passId;

function contextFunction(info, tab) {
	console.log(formId + " " + passId);
};

function handleMessages(msg) {
	if(msg.password == true) {
		passwordMenuId = chrome.contextMenus.create(
			{"title": "Setup a half-life password",
			 "contexts": ["all"],
			 "onclick": contextFunction});
		formId = msg.formId;
		passId = msg.passId;
		//console.log(msg.passId + " " + msg.formId);
	} else if(passwordMenuId) {
		chrome.contextMenus.remove(passwordMenuId);
		passwordMenuId = null;
	} 
}

// Scripting
chrome.extension.onConnect.addListener(function(port) {
	console.assert(port.name === "passhalf");
	port.onMessage.addListener(handleMessages);
});


