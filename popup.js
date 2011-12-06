// Copyright (C) 2011 Sean Swezey

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
