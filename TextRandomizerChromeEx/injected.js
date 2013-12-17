function onRequest(request, sender, sendResponse) {
	if (request.action == "getHistogram") {
		sendResponse(buildWordHistogram());
	} else if (request.action == "randomize") {
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
							if (isUpper) {
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
}

function buildWordHistogram() {
	var ignore = { "STYLE":0, "SCRIPT":0, "NOSCRIPT":0, "IFRAME":0, "OBJECT":0 };
	
	var wordCount = 0;
	var histogram = {};
	
	$("*").each(function() { 
		var jthis = $(this);
        if (jthis.children().length == 0) {
		
			// ignore markup
			if ((jthis.prop("tagName") in ignore)) {
				return;
			}
			
			var text = jthis.text();
			var textWords = text.match(/\w+/g);
			
			if (!textWords) {
				return;
			}
			
			var textWordsLen = textWords.length;
			
			// valid word
			if (textWordsLen > 0) {
				wordCount += textWordsLen;
				
				// normalize
				for (var i = 0; i < textWordsLen; i++) {
					var word = textWords[i].toLowerCase();
					if (histogram.hasOwnProperty(word)) {
						histogram[word]++;
					} else {
						histogram[word] = 0;
					}
				}
			}
		}
	});
	
	return {
		wordCount: wordCount,
		histogram: histogram
	};
}

chrome.runtime.onMessage.addListener(onRequest);
