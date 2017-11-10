function setup(){
	var settings = document.getElementById("settings");
	settings.className = 'settings-normal';
	
	var collapse = document.getElementById("collapse");
	collapse.innerHTML = '<span>Свернуть</span>';
	collapse.onclick = function(){
		var settings = document.getElementById("settings");
		console.log(settings.className);
		if(settings.className == '' || settings.className == 'settings-normal'){
			settings.className = 'settings-collapsed';
			this.innerHTML = '<span>Развернуть</span>';
		}else{
			settings.className = 'settings-normal';
			this.innerHTML = '<span>Свернуть</span>';
		}
	}
}

window.onload = function(){
	setup();
}