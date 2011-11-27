// Declarations
var commPort;

function handleMessages(msg){
	
}

function showContext(e){
	var node = e.target;
	if((e.which == 3) && (node.tagName.toLowerCase() === "input") && (node.type === "password")){
		//console.log({"passId": node.id, "formId": node.form.id});
		commPort.postMessage({"type": "pass", "passId": node.id});
		//console.log(node.value);
	} else {
		commPort.postMessage({"type": "pass", "passId": null});
	}
}

// Scripting
commPort = chrome.extension.connect({"name": "passhalf"});
commPort.onMessage.addListener(handleMessages);

$("body").on("mousedown", showContext);

var passfields = [];
$("input").each(function(i,e){
	if(this.type === "password"){
		passfields.push(e.id);
		console.log(e);
		commPort.postMessage({"type": "show", "fields": passfields});
	}
});
//commPort.postMessage({"type": "checkin"})
//console.log("dom_element.js loaded")
