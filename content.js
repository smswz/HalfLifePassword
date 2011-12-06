// Declarations
var commPort;
var passfields = [];
var formfields = [];

function handleMessages(msg){
	if(msg.type === "highlight"){
		$("#" + msg.id).css("background-color", "#A7F0A3");
	}

	if((msg.type === "unlight") && (msg.id != null)){
		$("#" + msg.id).css("background-color", "white");
	}

	if(msg.type === "replace"){
		$("#" + msg.passField).val(msg.pass);
	}

	if((msg.type === "replace") || (msg.type === "clear")){
		$("form").unbind().submit();
	}
}

function checkForReplace(e){
	e.preventDefault();

	var formData = new Object();
	formData.formId = e.target.id;
	formData.password = $("#" + passfields[formfields.indexOf(e.target.id)]).val();
	$("#" + e.target.id + " input").each(function(i,e){
		if($(this).attr("type") === "text"){
			formData[e.id] = $(e).val();
		}
	});
	commPort.postMessage({"type": "check", "formData": formData});

	return false;
}

// Scripting
commPort = chrome.extension.connect({"name": "content"});
commPort.onMessage.addListener(handleMessages);

$("input").each(function(i,e){
	if((this.type === "password") && (this.id !== "")){
		var parent = e;
		while(parent.tagName.toLowerCase() !== "form"){ parent = parent.parentNode };
		if(parent.id !== ""){
			passfields.push(e.id);
			formfields.push(parent.id);
			commPort.postMessage({"type": "show", "fields": passfields, "forms": formfields});
			$(parent).on("submit", checkForReplace);
		}
	}
});
