var commPort;

function handleMessages(msg) {
	
}

function generateHLP(e){
	var d = new Date();
	var hour = d.getHours().toString();
	var minute = d.getMinutes().toString();
	var day = d.getDate().toString();
	var month = (d.getMonth() + 1).toString();

	e.preventDefault();

	output = $("#jsform").val().toString();
	output = output.replace(new RegExp("%h", 'gm'),hour);
	output = output.replace(new RegExp("%m", 'gm'),minute);
	output = output.replace(new RegExp("%d", 'gm'),day);
	output = output.replace(new RegExp("%t", 'gm'),month);

	if(output !== ""){
		$("#example_out").html(output);
	} else {
		$("#example_out").html("Example output");
	}

}

function submitValues(e){
	e.preventDefault();
	input = $("#jsform").val().toString();
	user = $("#user").val().toString();
	password = $("#pass").val().toString();
	if((input !== "") && (user !== "") && (password !== "")){
		commPort.postMessage({"type": "result", "format": input, "user": user, "password": password});
	} else {
		$("#example_out").html("Make sure all fields are filled in!");
	}
}

function preventEnter(e){
	code = (e.keyCode ? e.keyCode : e.which);
	if(code == 13){ // prevent enter functionality
		e.preventDefault();
		input = $("#jsform").val().toString();
		user = $("#user").val().toString();
		password = $("#pass").val().toString();
		if((input !== "") && (user !== "") && (password !== "")){
			commPort.postMessage({"type": "result", "format": input, "user": user, "password": password});
		} else {
			$("#example_out").html("Make sure all fields are filled in!");
		}
	}
}

$(function() {
	// Highlight first field
	commPort.postMessage({"type": "init"});

	$(window).on("unload", function(e){
		// This is needed because the ports are already closed...
		chrome.extension.getBackgroundPage().contentPort.postMessage({"type": "unlight", "id": chrome.extension.getBackgroundPage().passId});
	});

	$("#prev_button").on("click", function(e){
		e.preventDefault();
		commPort.postMessage({"type": "wantPrev"});
	});

	$("#next_button").on("click", function(e){
		e.preventDefault();
		commPort.postMessage({"type": "wantNext"});
	});

	$("#jsform").on("blur", generateHLP);
	$("#jsform").on("keypress", preventEnter);

	$("#user").on("keypress", preventEnter);

	$("#pass").on("keypress", preventEnter);

	$("#save").on("click", submitValues);

	$("#test").on("click", generateHLP);

	$("#cancel").on("click", function(e){
		e.preventDefault();
		commPort.postMessage({"type": "close"});
	});
});

commPort = chrome.extension.connect({"name": "popup"});
commPort.onMessage.addListener(handleMessages);
