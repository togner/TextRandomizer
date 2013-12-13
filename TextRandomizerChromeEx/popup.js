
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
	vowelSwaps: 0,
	consonantSwaps: 5,
	multiLevelSwaps: false
};


function click(e) {
  chrome.tabs.executeScript(null, 
	{
		code:'document.body.innerHTML = document.body.innerHTML.replace(new RegExp("the", "g"), "dos");'
		
		//code:'document.body.style.backgroundColor="red"'
	});
  window.close();
}

$(document).ready(function() {
	$("#randButton").html("Randomize!");
	$("#randButton").bind('click', click);
	
	$(languages.keys).each(function() {
		var option = '<option value="' + this + 'Option">' + this + '</option>';
		$("#langSelect").append(option); 
	});
	
	console.log("test");
	
	console.log(sessionStorage.settings);
	
	// load settings
	var settings = sessionStorage.settings || defaultSettings;
	
	// set UI from settings
	$("#consonantSwapsInput").val(settings.consonantSwaps);
	
	//on change save settings
	$("#consonantSwapsInput").change(function() {
		var x = $(this).val();
		settings.consonantSwaps = $(this).val();
		sessionStorage.settings = settings;
		
		console.log("settings: " + settings);
		console.log("session settings: " + sessionStorage.settings);
	});
});