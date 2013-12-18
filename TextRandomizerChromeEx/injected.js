String.prototype.capitalize = function()
{
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function swap(text, wordSwaps) {
	var re = RegExp("\\w+", "g")
	var match;
	var result = "";
	var start = 0;
	while ((match = re.exec(text)) !== null) {
		result += text.substring(start, match.index);
		start = re.lastIndex;
		var matchKey = match[0].toLowerCase();
		if (!(matchKey in wordSwaps)) {
			// no swapping - just copy the text
			result += text.substring(match.index, re.lastIndex);
		} else {
			// swap word
			var swap = wordSwaps[matchKey];

			// if the swap has casing applied use it verbatim
			if (swap.toLowerCase() != swap) {
				result += swap;
			} else {
				// convert swap's casing to match's casing
				if (matchKey.toUpperCase() == match) {
					// upper-case
					result += swap.toUpperCase();
				} else if (matchKey.capitalize() == match) {
					// capital-case
					 result += swap.capitalize();
				} else {
					// lower-case or anything else
					result += swap; 
				}
			}
		}
	}
	result += text.substring(start, text.length);
	return result;
}

function swapWords(request) {
	traverseText(function() {
		var text = this.text();
		if (text == "" ||  text.trim().length == 0) {
			return;
		}
		text = swap(text, request.wordSwaps);
		this.text(text);
	});
}

function swapLetters(request) {
	traverseText(function() {
		var text = this.text();
		if (text == "" ||  text.trim().length == 0) {
			return;
		}
		
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
		this.text(result);
	});
}

function buildWordHistogram() {
	var wordCount = 0;
	var histogram = {};
	traverseText(function() {
		var text = this.text();
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
					histogram[word] = 1;
				}
			}
		}
	});
	return {
		wordCount: wordCount,
		histogram: histogram
	};
}

function traverseText(func) {
	var ignore = { "STYLE":0, "SCRIPT":0, "NOSCRIPT":0, "IFRAME":0, "OBJECT":0 };
	$("*").each(function() { 
		var jthis = $(this);
		if (jthis.children().length == 0) {
			// ignore markup
			if ((jthis.prop("tagName") in ignore)) {
				return;
			}
			func.call(jthis);
		}
	});
}

function onRequest(request, sender, sendResponse) {
	console.log(request);
	if (request.action == "getHistogram") {
		sendResponse(buildWordHistogram());
	} else if (request.action == "swapWords") {
		swapWords(request);
	} else if (request.action == "randomize") {
		swapLetters(request);
	}
}

chrome.runtime.onMessage.addListener(onRequest);
