function click(e) {
  chrome.tabs.executeScript(null, 
	{
		code:'document.body.innerHTML = document.body.innerHTML.replace(new RegExp("the", "g"), "dos");'
		
		//code:'document.body.style.backgroundColor="red"'
	});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});