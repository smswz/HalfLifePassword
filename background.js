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
var contentPort, popupPort,
	passFields, formFields,
	passId;

function handleContentMessages(msg) {
	if(msg.type === "show"){
		chrome.tabs.getSelected(null, function(t){
			chrome.pageAction.show(t.id);
		});
		passFields = msg.fields;
		formFields = msg.forms;
	}

	if(msg.type === "check"){
		chrome.tabs.getSelected(null, function(tab) {
    		var mod_url = tab.url.match(/(\w*\.\w{2,3})\//)[1];
    		var inLocalStorage = false;
    		var userField;
    		for(var field in msg.formData){
    			if(localStorage[mod_url + msg.formData[field]] != null){
    				inLocalStorage = true;
    				userField = msg.formData[field];
    			}
    		}
    		if(inLocalStorage){
    			var d = new Date();
				var hour = d.getHours().toString();
				var minute = d.getMinutes().toString();
				var day = d.getDate().toString();
				var month = (d.getMonth() + 1).toString();

				var storageObj = JSON.parse(localStorage[mod_url + userField]);

				var format = storageObj.format;
				format = format.replace(new RegExp("%h", 'gm'),hour);
				format = format.replace(new RegExp("%m", 'gm'),minute);
				format = format.replace(new RegExp("%d", 'gm'),day);
				format = format.replace(new RegExp("%t", 'gm'),month);

				if((msg.formData.password === format) || (msg.formData.password === storageObj.password)){
					contentPort.postMessage({"type": "replace", "form": storageObj.formField, "pass": storageObj.password, "passField": storageObj.passfield});
				} else {
					contentPort.postMessage({"type": "clear", "form": storageObj.formField});
				}
			} else {
				contentPort.postMessage({"type": "clear", "form": msg.formData.formId});
			}
		});
	}
}

function handlePopupMessages(msg) {
	if(typeof handlePopupMessages.passIndex == 'undefined'){ 
		handlePopupMessages.passIndex = 0;
	}

	if(msg.type !== "init"){
		contentPort.postMessage({"type": "unlight", "id": passId});
	}

	if(msg.type === "wantNext"){
		handlePopupMessages.passIndex = (handlePopupMessages.passIndex + 1) % passFields.length; 
	}

	if(msg.type === "wantPrev"){
		handlePopupMessages.passIndex--;
		if(handlePopupMessages.passIndex < 0){ handlePopupMessages.passIndex = passFields.length - 1}
	}

	if((msg.type === "init") || (msg.type === "wantNext") || (msg.type === "wantPrev")){
		contentPort.postMessage({"type": "highlight", "id": passFields[handlePopupMessages.passIndex]});
		passId = passFields[handlePopupMessages.passIndex];
	}

	if(msg.type === "result"){
		chrome.tabs.getSelected(null, function(tab) {
    		mod_url = tab.url.match(/(\w*\.\w{2,3})\//)[1];
    		// may save for later: .substring(0, mod_url.indexOf("."))
			var storageKey = mod_url + msg.user;
			var storageObj = Object();
			storageObj.user = msg.user;
			storageObj.format = msg.format;
			storageObj.password = msg.password;
			storageObj.passfield = passId;
			storageObj.formfield = formFields[passFields.indexOf(passId)];
			localStorage[storageKey] = JSON.stringify(storageObj);

		});
	}

	if((msg.type === "close") || (msg.type === "result")){
		chrome.tabs.getSelected(null, function(tab) {
    		chrome.tabs.update(tab.id, { selected: true });
		});
	}

}


// Scripting
chrome.extension.onConnect.addListener(function(port) {
	if(port.name === "content"){
		contentPort = port;
		port.onMessage.addListener(handleContentMessages);
	} else if(port.name === "popup"){
		popupPort = port;
		port.onMessage.addListener(handlePopupMessages);
	}
});


