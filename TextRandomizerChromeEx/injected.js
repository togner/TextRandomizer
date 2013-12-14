function onRequest(request, sender, sendResponse) {
	var ignore = { "STYLE":0, "SCRIPT":0, "NOSCRIPT":0, "IFRAME":0, "OBJECT":0 };
	
	$("*").each(function() { 
		var jthis = $(this);
        if (jthis.children().length == 0) {
			if (!(jthis.prop("tagName") in ignore)) {
				var text = jthis.text();
				if (text != "" &&  text.trim().length > 0) {
					// replace text of node based on the vowel/consonant swap maps
					var result = "";
					var textLen = text.length;
					for (var i = 0; i < textLen; i++) {
						var c = text[i].toLowerCase();
						var isUpper = (c != text[i]);
						var vowelIndex = request.vowelSwapMap.from.indexOf(c);
						var consonantIndex = request.consonantSwapMap.from.indexOf(c);
						if (vowelIndex != -1) {
							c = request.vowelSwapMap.to[vowelIndex];
						} else if (consonantIndex != -1) {
							c = request.consonantSwapMap.to[consonantIndex];
						}
						if (isUpper == "true") {
							c = c.toUpperCase();
						}
						result += c;
					}
					jthis.text(result);
				}
			}
        } 
    });
}

chrome.runtime.onMessage.addListener(onRequest);
