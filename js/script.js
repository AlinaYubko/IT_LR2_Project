// board size
var boardWidth = 10;
var boardHeight = 10;
var board2D;

// board move
var boardMove = false;
var boardMX, boardMY;
var boardMSkip = false;

// board cell
var cellSize = 20;
var cellSizeMin = 5;
var cellSizeMax = 50;
var cellSizeDelta = 2;

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
	
	var board = document.getElementById('board');
	var table = document.createElement('table');
	for(var j = 0; j < boardHeight; j++){
		var tr = document.createElement('tr');
		
		for(var i = 0; i < boardWidth; i++){
			var td = document.createElement('td');
			var cell = document.createElement('div');
			cell.className = 'cell';
			td.appendChild(cell);
			
			tr.appendChild(td);
		}
		
		table.appendChild(tr);
	}
	
	board.appendChild(table);
	
	board.onmousedown = function(event){
		boardMove = true;
		boardMX = event.clientX;
		boardMY = event.clientY;
	}
	
	board.onmouseup = function(){
		boardMove = false;
	}
	window.onmouseup = function(){
		boardMove = false;
	}
	
	window.onmousemove = function(event){
		if(boardMove){
			var nbMX = event.clientX;
			var nbMY = event.clientY;
			window.scrollBy(boardMX - nbMX, boardMY - nbMY);
			boardMX = nbMX;
			boardMY = nbMY;
		}
	}
	
	board.addEventListener("mousewheel", MouseWheelHandler, false);
	board.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	
	var inputWidth = document.getElementsByName("width")[0];
	inputWidth.value = boardWidth;
	var inputHeight = document.getElementsByName("height")[0];
	inputHeight.value = boardHeight;
	inputWidth.onchange = function(){
		onchangeBoardWH();
	}
	inputHeight.onchange = function(){
		onchangeBoardWH();
	}
	
	//test
}

function onchangeBoardWH(){
	var bWidthInput = document.getElementsByName("width")[0];
	bWidthInput.disabled = true;
	var bHeightInput = document.getElementsByName("height")[0];
	bHeightInput.disabled = true;
	
	boardSet(bWidthInput.value, bHeightInput.value);
	
	bWidthInput.disabled = false;
	bHeightInput.disabled = false;
	
}

function onclickCell(){
	console.log("Cell [y: " + this.getAttribute("y") + "; x: " + this.getAttribute("x") + "]");
}

function boardSet(bWidth, bHeight){
	var board = document.getElementById('board');
	var table = board.children[0];
	if(board.children.length > 0){
		board.removeChild(table);
	}
	table = document.createElement('table');
	
	boardWidth = bWidth;
	boardHeight = bHeight;
	//board2D = 
	
	for(var j = 0; j < boardHeight; j++){
		var tr = document.createElement('tr');
		
		for(var i = 0; i < boardWidth; i++){
			var td = document.createElement('td');
			var cell = document.createElement('div');
			if(Math.random() < 0.4){
				cell.className = 'cell cell-wall';
			}else if(Math.random() < 0.6){
				cell.className = 'cell cell-block';
			}else{
				cell.className = 'cell';
			}
			cell.setAttribute("y", j);
			cell.setAttribute("x", i);
			cell.onclick = onclickCell;
			td.appendChild(cell);
			
			tr.appendChild(td);
		}
		
		table.appendChild(tr);
	}
	
	board.appendChild(table);
}

function MouseWheelHandler(e) {
	e.preventDefault();
	
	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	
	console.log("delta " + delta);
	if(delta > 0 || delta < 0){
		if(delta > 0){
			cellSize += cellSizeDelta;
		}else if(delta < 0){
			cellSize -= cellSizeDelta;
		}
		
		if(cellSize < cellSizeMin){
			cellSize = cellSizeMin;
		}
		
		if(cellSize > cellSizeMax){
			cellSize = cellSizeMax;
		}
		
		jss.set('div.cell', {'width': cellSize+'px', 'height': cellSize+'px'});
		/*
		var el = document.getElementsByClassName("cell");
		for(var i = 0; i < el.length; i++){
			el[i].style.width = cellSize + "px";
			el[i].style.height = cellSize + "px";
		}*/
	}
	
	return false;
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
