// Declarations
var commPort;

function handleMessages(msg){
	
}

function showContext(e){
	var node = e.target;
	if((e.which == 3) && (node.tagName.toLowerCase() === "input") && (node.type === "password")){
		//console.log({"passId": node.id, "formId": node.form.id});
		commPort.postMessage({"password": true, "passId": node.id});
		//console.log(node.value);
	} else {
		commPort.postMessage({"password": false});
	}
}

// Scripting
commPort = chrome.extension.connect({"name": "passhalf"});
commPort.onMessage.addListener(handleMessages);

$("body").on("mousedown", showContext);
//console.log("dom_element.js loaded")
