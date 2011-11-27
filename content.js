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
commPort = chrome.extension.connect({"name": "content"});
commPort.onMessage.addListener(handleMessages);

$("body").on("mousedown", showContext);

var passfields = [];
var formfields = [];
$("input").each(function(i,e){
	if(this.type === "password"){
		var parent = e;
		while(parent.tagName.toLowerCase() !== "form"){ parent = parent.parentNode };
		passfields.push(e.id);
		formfields.push(parent.id);
		console.log(e);
		console.log(parent);
		commPort.postMessage({"type": "show", "fields": passfields, "forms": formfields});
	}
});
//commPort.postMessage({"type": "checkin"})
//console.log("dom_element.js loaded")
