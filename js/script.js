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
	
	addNewSet();
	
	var addSet = document.getElementById("add_set");
	addSet.onclick = function(){
		addNewSet();
	}
	
	var remSet = document.getElementById("zem_set");
	remSet.onclick = function(){
		remLastSet();
	}
}

function addNewSet(){
	var el = document.createElement("div");
	el.className = "another_set";
	var cont = document.getElementById("sets");
	cont.appendChild(el);
}

function remLastSet(){
	var cont = document.getElementById("sets");
	if(cont.children.length >= 2){
		console.log(cont.lastChild);
		cont.removeChild(cont.lastChild);
	}
}

window.onload = function(){
	setup();
}