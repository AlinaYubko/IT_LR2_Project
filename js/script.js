// board size
var boardWidth = 10;
var boardHeight = 10;
var boardMaxSize = 100;
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
var cellClass = "cell";
var cellBlockClass = "cell cell-block";
var cellWallClass = "cell cell-wall";

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
	
	// init board
	board2D = board2DInit();
	
	boardSet(boardWidth, boardHeight);
	
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

function board2DInit() {
	board2D = [];
	for(var j = 0; j < boardMaxSize; j++){
		var col = [];
		for(var i = 0; i < boardMaxSize; i++){
			col[i] = 0;
		}
		board2D[j] = col;
	}
	
	return board2D;
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
	var that = this;
	var x = this.getAttribute("x");
	var y = this.getAttribute("y");
	
	if(board2D[y][x] == 0){
		board2D[y][x] = 1;
		console.log("Cell [y: " + y + "; x: " + x + "] - Set!");
		
		that.className = cellBlockClass;
	}else{
		board2D[y][x] = 0;
		console.log("Cell [y: " + y + "; x: " + x + "] - Unset.");
		
		that.className = cellClass;
	}
}

function onrightclickCell(e){
	e.preventDefault();
	
	var that = e.target;
	var x = e.target.getAttribute("x")
	var y = e.target.getAttribute("y")
	
	if(board2D[y][x] == 0){
		board2D[y][x] = -1;
		console.log("Wall-Cell [y: " + y + "; x: " + x + "] - Set!");
		
		that.className = cellWallClass;
	}else{
		board2D[y][x] = 0;
		console.log("Wall-Cell [y: " + y + "; x: " + x + "] - Unset.");
		
		that.className = cellClass;
	}
}

function getCellClass(y, x){
	if(board2D[y][x] == -1){
		return cellWallClass;
	}
	
	if(board2D[y][x] >= 1){
		return cellBlockClass;
	}
	
	return cellClass;
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
			cell.className = getCellClass(j, i)
			cell.setAttribute("y", j);
			cell.setAttribute("x", i);
			cell.onclick = onclickCell;
			cell.addEventListener("contextmenu", function(event){ onrightclickCell(event); });
			td.appendChild(cell);
			
			tr.appendChild(td);
		}
		
		table.appendChild(tr);
	}
	
	board.appendChild(table);
}

function updateBoard(){
	
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
