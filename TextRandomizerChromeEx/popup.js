/*************** objects and globals ***************/

function LanguageSet(consonants, vowels) {
	this.consonants = consonants;
	this.vowels = vowels;
}

var languages = {
	keys: ["English", "Slovak"],
	values: [new LanguageSet("bcdfghjklmnpqrstvwxyz", "aeiou"), 
		new LanguageSet("bcčdďfghjklĺľmnňprŕsštťvzž", "aáäeéiíuúoóôyý")]
};

var defaultSettings = {
	languageKey: languages.keys[0],
	vowelSwaps: 0,
	consonantSwaps: 5,
	multiLevelSwaps: false,
	mode: "letters"
};

/*************** string extensions ***************/

// randomly shuffle string
String.prototype.shuffle = function () {
    var chars = this.split("");
    var len = chars.length;
    for(var i = len - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = chars[i];
        chars[i] = chars[j];
        chars[j] = tmp;
    }
    return chars.join("");
}

// remove all chars from string that are in the exceptString
String.prototype.except = function (exceptString) {
    var re = new RegExp("[" + exceptString + "]*", "ig");
    return this.replace(re, "");
}

/*************** static functions ***************/

function buildSwapMap(fromChars, toChars, maxSwaps, multiLevelSwaps) {
    var randFrom = fromChars.shuffle().substring(0, maxSwaps);
    
    // except
    if (localStorage.multiLevelSwaps != "true") {
        toChars = toChars.except(randFrom);
    }
    
    var randTo = toChars.shuffle().substring(0, maxSwaps);
    
    return {
        from: randFrom,
        to: randTo
    }
}

// main randomize method
function randomize(e) {
	var language = languages.values[languages.keys.indexOf(localStorage.languageKey)];
	var text = $("body").text();

	// extract consonants and vowels from text, transform to lower case
	var textConsonants = "";
	var textVowels = "";
	var textLen = text.length;
	for (var i = 0; i < textLen; i++) {
		var c = text[i].toLowerCase();
		if (language.consonants.indexOf(c) != -1
			&& textConsonants.indexOf(c) == -1) {
			textConsonants += c;
		}
		else if (language.vowels.indexOf(c) != -1
			&& textVowels.indexOf(c) == -1) {
			textVowels += c;
		}
	}

	// build swap maps
	var maxConsonantSwaps = Math.min(parseInt(localStorage.consonantSwaps), Math.floor(language.consonants.length / 2), textConsonants.length);
	var maxVowelSwaps = Math.min(parseInt(localStorage.vowelSwaps), Math.floor(language.vowels.length / 2), textVowels.length);

	var consonantSwapMap = buildSwapMap(textConsonants, language.consonants, maxConsonantSwaps, localStorage.multiLevelSwaps);
	var vowelSwapMap = buildSwapMap(textVowels, language.vowels, maxVowelSwaps, localStorage.multiLevelSwaps);

	// send swap maps to randomizer content script
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {consonantSwapMap: consonantSwapMap, vowelSwapMap: vowelSwapMap});
	});
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
			var textWords = text.match(/\S+/g);
			
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
	
	// get keys (words) and sort them by value (count) desc
	var keys = [];
	for(var prop in histogram) {
		keys[keys.length] = prop;
	}
	keys.sort(function(a, b) {
		return histogram[b] - histogram[a];
	});
	
	// populate histogram GUI
	var keysLen = keys.length;
	for (var i = 0; i < keysLen; i++) {
		var percent = Math.round(100 * histogram[keys[i]] / wordCount);
		$("#histogram")
			.append('<tr>'
			+ '<td class="key">' + keys[i] + '</td>'
			+ '<td><input></input></td>'
			+ '</tr><tr>'
			+ '<td colspan="2"><img src="bar.png" width="' + percent + '" height="5" /><span>' + percent + '%</span></td>'
			+ '</tr>');
	}
}

function resetSettings(e) {
	localStorage.clear();
	initSettings();
	initSettingsUI();
}

function initSettings() {
	// load settings
	if (localStorage.languageKey === undefined || $.inArray(localStorage.languageKey, languages.keys) === -1) {
		localStorage.languageKey = defaultSettings.languageKey;
	}
	localStorage.vowelSwaps = localStorage.vowelSwaps || defaultSettings.vowelSwaps;
	localStorage.consonantSwaps = localStorage.consonantSwaps || defaultSettings.consonantSwaps;
	localStorage.multiLevelSwaps = localStorage.multiLevelSwaps || defaultSettings.multiLevelSwaps;
	localStorage.mode = localStorage.mode || defaultSettings.mode;
	
	// log settings
	for (var setting in localStorage) {
		console.log("localStorage." + setting + ": " + localStorage[setting]);
	}
}

// set UI from settings, hook on change handlers
function initSettingsUI() {
	$(languages.keys).each(function() {
		var option = '<option value="' + this + '">' + this + '</option>';
		$("#langSelect").append(option); 
	});
	$("#langSelect")
		.val(localStorage.languageKey)
		.change(function() {
			localStorage.languageKey = $(this).val();
		});
	$("#consonantSwapsInput")
		.val(localStorage.consonantSwaps)
		.change(function() {
			var value = $(this).val();
			if (value != "") {
				localStorage.consonantSwaps = value;
			}
		});
	$("#vowelSwapsInput")
		.val(localStorage.vowelSwaps)
		.change(function() {
			var value = $(this).val();
			if (value != "") {
				localStorage.vowelSwaps = value;
			}
		});
	$("#multiLevelSwapsCheck")
		.attr("checked", localStorage.multiLevelSwaps == "true")
		.change(function() {
			localStorage.multiLevelSwaps = $(this).is(":checked");
			console.log(localStorage.multiLevelSwaps);
		});
		
	// toggle tab
	$("#" + localStorage.mode + "Tab").addClass('active').siblings().removeClass('active');
	$("#" + localStorage.mode + "TabButton").addClass('active').siblings().removeClass('active');
	
	// hook tab toggle
	$("#lettersTabButton").bind('click', function(e) {
		$("#lettersTab").addClass('active').siblings().removeClass('active');
		$(this).addClass('active').siblings().removeClass('active');
		localStorage.mode = "letters";
	});
	$("#wordsTabButton").bind('click', function(e) {
		$("#wordsTab").addClass('active').siblings().removeClass('active');
		$(this).addClass('active').siblings().removeClass('active');
		localStorage.mode = "words";
	});
}

$(document).ready(function() {
	$("#defaultButton").bind('click', resetSettings);
	$("#randButton").bind('click', randomize);
	
	initSettings();
	initSettingsUI();
	
	buildWordHistogram();
});

