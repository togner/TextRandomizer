function click(e) {
  chrome.tabs.executeScript(null, 
	{
		code:'document.body.innerHTML = document.body.innerHTML.replace(new RegExp("the", "g"), "dos");'
		
		//code:'document.body.style.backgroundColor="red"'
	});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
	$("#randomize").html("Randomize!");
	$("#randomize").bind('click', click);
});