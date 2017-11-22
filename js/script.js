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
var cellClassPrefix = "cell cell-";
var cellBlockClass = "cell cell-block";
var cellWallClass = "cell cell-wall";
var cellStyleBGPart = "linear-gradient(135deg, rgba(0,0,0,0.36) 0%,rgba(0,0,0,0.21) 50%,rgba(0,0,0,0.36) 100%)";

// cells
var cellTypes = [];
var currentCellType = 1;
var maxCellTypes = 7;

// calculations
var wrapBorders = false;
var activeCellType = 1;
var calcCellTypes = [];
var calcInitBoard;
var calcStepBoardLast;
var calcStepBoardNext;
var pauseResume = true;

//creation
var textFile = null;

//misc
var configsJSON = "config/configs.json";
var boardConfigs = [];

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
			boardMSkip = true;
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
	
	var infoButton = document.getElementById("button_info");
	infoButton.onclick = function(){
		var info = document.getElementById("info");
		info.style.display = "block";
	}
	
	var info = document.getElementById("info");
	info.onclick = function(){
		var info = document.getElementById("info");
		info.style.display = "none";
	}
	
	var startButton = document.getElementById("start_button");
	startButton.onclick = function(){
		setControlButtonsDisabledState(true, false, false);
		startCalculations();
	}
	
	var pauseButton = document.getElementById("pause_button");
	pauseButton.onclick = function(){
		setControlButtonsDisabledState(true, false, false);
		pauseResumeCalculations();
	}
	
	var stopButton = document.getElementById("stop_button");
	stopButton.onclick = function(){
		setControlButtonsDisabledState(false, true, true);
		stopCalculations();
	}
	
	setControlButtonsDisabledState(false, true, true);
	
	var saveButton = document.getElementById("save_config");
	saveButton.onclick = function(){
		downloadJSON("config.json", boardToJSON());
	}
	
	var wrapBordersCheckbox = document.getElementsByName("wrap")[0];
	wrapBordersCheckbox.onclick = function(){
		var wrapBordersCheckbox = document.getElementsByName("wrap")[0];
		wrapBordersCheckbox.value = !(wrapBordersCheckbox.value);
		console.log("Wrap boarders - " + wrapBordersCheckbox.checked);
	}
	
	var configsList = document.getElementById("config");
	while (configsList.hasChildNodes()) {
		configsList.removeChild(configsList.lastChild);
	}
	$.getJSON(configsJSON, function(data){
		for(var i = 0; i < data.configs.length; i++){
			if(data.configs[i].json != null){
				$.getJSON(data.configs[i].json, function(cdata){
					boardConfigs.push(cdata);
					var configsList = document.getElementById("config");
					var opt = document.createElement("option");
					opt.value = cdata.name;
					opt.innerHTML = cdata.name;
					configsList.appendChild(opt);
				});
			}
		}
	});	
	//test
}

function boardToJSON(){
	var board = {
		name: "Default config name",
		wrapBorders: wrapBorders,
		width: boardWidth,
		height: boardHeight,
		cells: []
	};
	
	for(var j = 0; j < boardHeight; j++){
		for(var i = 0; i < boardWidth; i++){
			if(board2D[j][i] != 0){
				board.cells.push({x: i, y: j, v: board2D[j][i]});
			}
		}
	}
	var text = JSON.stringify(board);
	console.log(text);
	var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
	
	textFile = window.URL.createObjectURL(data);

    return textFile;
}

function downloadJSON(filename, fileURL) {
    var a = document.createElement('a');
    a.style = "display: none";  
    a.href = fileURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
        document.body.removeChild(a);  
    }, 250);      
}

function setControlButtonsDisabledState(start_s, pause_s, stop_s){
	var startButton = document.getElementById("start_button");
	startButton.disabled = start_s;
	var pauseButton = document.getElementById("pause_button");
	pauseButton.disabled = pause_s;
	var stopButton = document.getElementById("stop_button");
	stopButton.disabled = stop_s;
}

function startCalculations(){
	
}

function pauseResumeCalculations(){
	if(pauseResume){
		pauseResume = false;
		console.log("Paused");
		
	}else{
		pauseResume = true;
		console.log("Resumed");
		
	}
}

function stopCalculations(){

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
	if(!boardMSkip){
		var that = this;
		var x = this.getAttribute("x");
		var y = this.getAttribute("y");
		
		if(board2D[y][x] == 0){
			board2D[y][x] = currentCellType;
			console.log("Cell [y: " + y + "; x: " + x + "] - Set to " + currentCellType + "!");
			
			that.className = cellClass + " " + cellClassPrefix + (currentCellType-1);
		}else{
			board2D[y][x] = 0;
			console.log("Cell [y: " + y + "; x: " + x + "] - Unset.");
			
			that.className = cellClass;
		}
	}else{
		boardMSkip = false;
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
		return cellClassPrefix + (board2D[y][x]-1);
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
	
	//console.log("delta " + delta);
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
	
	var params = ["Выбор для рисования", "Цвет", "Соседей для появления", "Соседей для выживания", "Соседей для смерти", "Уникальный набор"];
	var text_ID = ["setSelection_text", "setColor_text", "nToBorn_text", "nToSurvive_text", "nToDie_text", "uniqueSet_text"];
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
	var blockDrawing = document.getElementsByName("blockDrawing");
	blockDrawing[0].checked = true;
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
	
	var types = ["radio", "color", "number", "number", "number", "checkbox"];
	var nToSpawn = 3 + Math.floor(Math.random() * 5);
	var nToSurvive = 2 + Math.floor((nToSpawn - 3)*Math.random());
	var nToDie = nToSpawn + 1 + Math.floor((8 - nToSpawn) * Math.random());
	//console.log("S: " + nToSpawn + ", D: " + nToDie);
	var values = [null, null, nToSpawn, nToSurvive, nToDie, (Math.random() >= 0.5 ? true : false)];
	for(var i = 0; i < 6; i++){
		var input = document.createElement("input");
		input.setAttribute("type", types[i]);
		if(i == 0){
			input.setAttribute("name", "blockDrawing");
			input.onchange = function(){
				var blockDrawing = document.getElementsByName("blockDrawing");
				for(var i = 0; i < blockDrawing.length; i++){
					if(blockDrawing[i].checked){
						currentCellType = i + 1;
						console.log("drawing block changed - #" + currentCellType);
						break;
					}
				}
			}
		}
		if(i == 1){
			input = document.createElement("div");
			input.className = ("cell-" + n);
			input.style = "width: 16px; height: 16px; margin: auto;";
		}
		if(i < 5){
			//console.log("v: " + values[i]);
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
	
	var add = document.getElementById("add_set");
	if(n >= maxCellTypes){
		add.disabled = true;
	}else{
		add.disabled = false;
	}
}

function setDrawingBlock(){
	
}

function remLastSet(){
	if(cellTypes.length > 1){
		if(currentCellType == cellTypes.length){
			var blockDrawing = document.getElementsByName("blockDrawing");
			if(blockDrawing[blockDrawing.length-1].checked){
				blockDrawing[blockDrawing.length-2].checked = true;
				currentCellType--;
			}
		}
		
		cellTypes.pop();
		
		var setsTable = document.getElementById("sets_table");
		for(var j = 0; j < 6; j++){
			var tr = setsTable.children[j];
			
			tr.removeChild(tr.lastChild);
		}
		
		if(cellTypes.length <= 1){
			var rem = document.getElementById("zem_set");
			rem.disabled = true;
		}
	}
	
	var add = document.getElementById("add_set");
	if(cellTypes.length >= maxCellTypes){
		add.disabled = true;
	}else{
		add.disabled = false;
	}
}

window.onload = function(){
	setup();
}
