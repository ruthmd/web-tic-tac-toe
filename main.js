var board = new Array(9);

function init() {

  var down = "mousedown"; var up = "mouseup";
  document.querySelector("input.button").addEventListener(up, newGame, false);
  var squares = document.getElementsByTagName("td");
  for (var s = 0; s < squares.length; s++) {
    squares[s].addEventListener(down, function(evt){squareSelected(evt, getCurrentPlayer());}, false);
  }
  createBoard();
  setInitialPlayer();
}


function createBoard() {
 //get the board from ls if exist
 if (window.localStorage && localStorage.getItem('tic-tac-toe-board')) {

    //board string in ls (json) to array in js
    board = (JSON.parse(localStorage.getItem('tic-tac-toe-board')));
    for (var i = 0; i < board.length; i++) {
      if (board[i] != "") {
        fillSquareWithMarker(document.getElementById(i), board[i]);
      }
    }
  }
  //create new board
  else {
    for (var i = 0; i < board.length; i++) {
      board[i] = "";
      document.getElementById(i).innerHTML = "";
    }
  }
}

function squareSelected(evt, currentPlayer) {
  var square = evt.target;
  //check the existing content
  if (square.className.match(/marker/)) {
    snack_msg("Space is taken!,choose another square.");
    return;
  }
  //next move
  else {
    fillSquareWithMarker(square, currentPlayer);
    updateBoard(square.id, currentPlayer);
    checkForWinner();
    switchPlayers();
  }
}

function fillSquareWithMarker(square, player) {
  var marker = document.createElement('div');
  marker.className = player + "-marker";//curr x-marker or o-marker
  square.appendChild(marker);
}

function updateBoard(index, marker) {
  board[index] = marker;

  var boardstring = JSON.stringify(board);//curr state of the board to ls ,ls can store string

  localStorage.setItem('tic-tac-toe-board', boardstring);
  localStorage.setItem('last-player', getCurrentPlayer());//keep track of the last player -> ls
}


function declareWinner() {
    snack_msg("We have a winner!");
    newGame();
}

function weHaveAWinner(a, b, c) {
  if ((board[a] === board[b]) && (board[b] === board[c]) && (board[a] != "" || board[b] != "" || board[c] != "")) {
    setTimeout(declareWinner(), 100);
    return true;
  }
  else
    return false;
}

function checkForWinner() {
 //rows
  var a = 0; var b = 1; var c = 2;
  while (c < board.length) {
    if (weHaveAWinner(a, b, c)) {
      return;
    }
    a+=3; b+=3; c+=3;
  }

  // columns
  a = 0; b = 3; c = 6;
  while (c < board.length) {
    if (weHaveAWinner(a, b, c)) {
      return;
    }
    a+=1; b+=1; c+=1;
  }

  //dia lc-r
  if (weHaveAWinner(0, 4, 8)) {
    return;
  }
  //dia rc-l
  if (weHaveAWinner(2, 4, 6)) {
    return;
  }

  // no winner -> board is full
  if (!JSON.stringify(board).match(/,"",/)) {
    snack_msg("It's a draw");
    newGame();
  }
}

function getCurrentPlayer() {
  return document.querySelector(".current-player").id;
}

function setInitialPlayer() {
  var playerX = document.getElementById("X");
  var playerO = document.getElementById("O");
  playerX.className = "";
  playerO.className = "";

  if (!window.localStorage || !localStorage.getItem('last-player')) {
    playerX.className = "current-player";//set x as 1st player by default
    return;
  }

  var lastPlayer = localStorage.getItem('last-player');
  if (lastPlayer == 'X') {
    playerO.className = "current-player";
  }
  else {
    playerX.className = "current-player";
  }
}

function switchPlayers() {
  var playerX = document.getElementById("X");
  var playerO = document.getElementById("O");

  if (playerX.className.match(/current-player/)) {
    playerO.className = "current-player";
    playerX.className = "";
  }
  else {
    playerX.className = "current-player";
    playerO.className = "";
  }
}

function newGame() {
  localStorage.removeItem('tic-tac-toe-board');
  localStorage.removeItem('last-player');
  // snack_msg("New Game");
  createBoard();
}



function snack_msg(msg) {
    if (msg!=null) {
        var sd = document.createElement("div");
        sd.setAttribute("id", "snackbar");
        sd.innerHTML = msg;
        document.body.appendChild(sd);
        sd.className = "show";
        setTimeout(function(){ sd.className = sd.className.replace("show", ""); }, 3000);
    }
}
