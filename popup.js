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

$(function() {
	// Highlight first field
	commPort.postMessage({"type": "init"});

	$("#prev_button").on("click", function(e){
		e.preventDefault();
		commPort.postMessage({"type": "wantPrev"});
	});

	$("#next_button").on("click", function(e){
		e.preventDefault();
		commPort.postMessage({"type": "wantNext"});
	});

	$("#test").on("click", generateHLP);
	$("#jsform").on("blur", generateHLP);

	$("#save").on("click", function(e){
		e.preventDefault();
		input = $("#jsform").val().toString();
		password = $("#pass").val().toString();
		if((input !== "") && (password !== "")){
			commPort.postMessage({"type": "result", "format": input, "password": pass});
		} else {
			$("#example_out").html("Make sure both fields are filled in!");
		}
	});

	$("#cancel").on("click", function(e){
		e.preventDefault();
		commPort.postMessage({"type": "close"});
	})
});

commPort = chrome.extension.connect({"name": "popup"});
commPort.onMessage.addListener(handleMessages);
