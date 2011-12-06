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
