// Declarations
var commPort;
var passfields = [];
var formfields = [];

function handleMessages(msg){
	if(msg.type === "highlight"){
		$("#" + msg.id).css("background-color", "#A7F0A3");
	} else if((msg.type === "unlight") && (msg.id != null)){
		$("#" + msg.id).css("background-color", "white");
	}
}

// Scripting
commPort = chrome.extension.connect({"name": "content"});
commPort.onMessage.addListener(handleMessages);

$("input").each(function(i,e){
	if(this.type === "password"){
		var parent = e;
		while(parent.tagName.toLowerCase() !== "form"){ parent = parent.parentNode };
		passfields.push(e.id);
		formfields.push(parent.id);
		commPort.postMessage({"type": "show", "fields": passfields, "forms": formfields});
	}
});
//commPort.postMessage({"type": "checkin"})
//console.log("dom_element.js loaded")
