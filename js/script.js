function setup(){
	var settings = document.getElementById("settings");
	settings.className = 'settings-normal';
	
	var collapseIT = '<span>&#x25B4; Свернуть</span>';
	var collapseITClass = 'settings-normal';
	var uncollpaseIT = '<span>&#x25BE; Развернуть</span>';
	var uncollapseITClass = 'settings-collapsed';
	
	var collapse = document.getElementById("collapse");
	collapse.innerHTML = collapseIT;
	collapse.onclick = function(){
		var settings = document.getElementById("settings");
		console.log(settings.className);
		if(settings.className == '' || settings.className == collapseITClass){
			settings.className = uncollapseITClass;
			this.innerHTML = uncollpaseIT;
		}else{
			settings.className = collapseITClass;
			this.innerHTML = collapseIT;
		}
	}
}

window.onload = function(){
	setup();
}