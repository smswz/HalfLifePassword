// Declarations
var passwordMenuId, passId;

function contextFunction(info, tab) {
	console.log(passId);
};

function handleMessages(msg) {
	if((msg.password == true) && (!passwordMenuId)){
		passwordMenuId = chrome.contextMenus.create(
			{"title": "Setup a half-life password",
			 "contexts": ["all"],
			 "onclick": contextFunction});
		passId = msg.passId;
		//console.log(msg.passId + " " + msg.formId);
	} else if((msg.password == false ) && (passwordMenuId)) {
		chrome.contextMenus.remove(passwordMenuId);
		passwordMenuId = null;
	} 
}

// Scripting
chrome.extension.onConnect.addListener(function(port) {
	console.assert(port.name === "passhalf");
	port.onMessage.addListener(handleMessages);
});


