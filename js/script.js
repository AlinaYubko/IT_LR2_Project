// board size
var boardWidth = 10;
var boardHeight = 10;
var boardMaxSize = 100;
var board2D;
var board2DInitial;

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

// cells
var cellTypes = [];
var currentCellType = 1;

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
	
	initSets();
	
	var addSet = document.getElementById("add_set");
	addSet.onclick = function(){
		addNewSet();
	}
	
	var remSet = document.getElementById("zem_set");
	remSet.disabled = true;
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
	board2DInitial = [];
	for(var j = 0; j < boardMaxSize; j++){
		var col = [];
		var col_ = [];
		for(var i = 0; i < boardMaxSize; i++){
			col[i] = 0;
			col_[i] = 0;
		}
		board2D[j] = col;
		board2DInitial[j] = col_;
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
	}
	
	return false;
}

function initSets(){
	var cont = document.getElementById("sets");
	var setsTable = document.createElement("table");
	setsTable.setAttribute("id", "sets_table");
	
	var params = ["Выбор для рисования", "Цвет", "Соседей для появления", "Соседей для смерти", "Уникальный набор"];
	var text_ID = ["setSelection_text", "setColor_text", "nToBorn_text", "nToDie_text", "uniqueSet_text"];
	for(var j = 0; j < params.length; j++){
		var tr = document.createElement("tr");
		var td = document.createElement("td");
		var p = document.createElement("p");
		p.setAttribute("id", text_ID[j]);
		p.innerHTML = params[j];
		td.appendChild(p);
		tr.appendChild(td);
		
		setsTable.appendChild(tr);
	}
	
	cont.appendChild(setsTable);
	
	addNewSet();
}

function randomColor(){
	var letters = '0123456789abcdef';
	var ret = '#';
	for (var i = 0; i < 6; i++) {
		ret += letters[Math.floor(Math.random() * 16)];
	}
	console.log(ret);
	return ret;
}

function addNewSet(){
	var setsTable = document.getElementById("sets_table");
	
	var n = cellTypes.length;
	
	var types = ["radio", "color", "number", "number", "checkbox"];
	var nToSpawn = 1 + Math.floor(Math.random() * 6);
	var nToDie = nToSpawn + 1 + Math.floor((8 - nToSpawn) * Math.random());
	console.log("S: " + nToSpawn + ", D: " + nToDie);
	var values = [null, randomColor(), nToSpawn, nToDie, (Math.random >= 0.5 ? true : false)];
	for(var i = 0; i < 5; i++){
		var input = document.createElement("input");
		input.setAttribute("type", types[i]);
		if(i == 0){
			input.setAttribute("name", "blockDrawing");
		}
		if(i < 4){
			console.log("v: " + values[i]);
			input.value = values[i];
		}else{
			input.checked = values[i];
		}
		var td = document.createElement("td");
		td.appendChild(input);
		setsTable.children[i].appendChild(td);
	}
	
	var rem = document.getElementById("zem_set");
	rem.disabled = false;
	
	cellTypes[n] = {color: values[0], spawn: nToSpawn, die: nToDie, unique: values[3]};
}

function remLastSet(){
	if(cellTypes.length > 1){
		cellTypes.pop();
		
		var setsTable = document.getElementById("sets_table");
		for(var j = 0; j < 5; j++){
			var tr = setsTable.children[j];
			
			tr.removeChild(tr.lastChild);
		}
		
		if(cellTypes.length <= 1){
			var rem = document.getElementById("zem_set");
			rem.disabled = true;
		}
	}
}

window.onload = function(){
	setup();
}
