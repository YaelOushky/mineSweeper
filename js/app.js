'use strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ' '
var gBoard
var gGameInterval
var gLife
var gNeighborsMainCount

// var gBoard = {  //The model
//     minesAroundCount: 0,   // מוקשים מסביב לתא
//     isShown: false,   //האם לחצו עליו
//     isMine: false,  // האם מוקש
//     isMarked: false  // האם סומן בדגל
// }
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,  //boolean, when true we let the user play
    shownCount: 0,  // how many cells are shown
    markedCount: 0,  // how many cells are marked (with a flag)
    secsPassed: 0  // how many seconds passed
}

function init() {
    // Todo play the game 
    gLife = 3
    gNeighborsMainCount = null
    gGame.isOn = true
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    if (gGame.isOn) setTimer()

    clearInterval(gGameInterval)
    document.querySelector('.emoji').innerText = '😄'
    gBoard = createBoard(gLevel.size)
    renderBoard(gBoard)
}


function setLevel(size, mines) {
    //  Support 3 levels of the game onclick level
    gLevel['size'] = size
    gLevel['mines'] = mines
    var elMines = document.querySelector('.bomes')
    elMines.innerText = mines
    init()
}


function endGame() {
    console.log('game over');
    //loos
    document.querySelector('.emoji').innerText = '😭'
    //victory
    clearInterval(gGameInterval)
    // document.querySelector('.emoji').innerText = '😎'
}

function checkGameOver() {
    if (gLife === 0) endGame()
    // Todo
    //  LOSE: when clicking a mine, all mines should be revealed
    //  WIN: all the mines are flagged, and all the other cells are shown
}

function cellMarked(elCell) {

    // Todo Called on right click to mark a cell (suspected to be a mine)
    //Search the web (and  implement) how to hide the 
    //context menu on right click

    // if (gBoard[i][j].isMarked ) 
}

function cellClicked(i, j, elCell, event) {
    gGame.shownCount++

    if (gGame.shownCount === 1) gGame.isOn === true

    gBoard[i][j].isShown = true

    var neighbors = countNeighbors(i, j, gBoard)

    if (gBoard[i][j].isMarked) cellMarked(elCell)

    if (gBoard[i][j].isMine) {
        var elLife = document.querySelector('.life span')
        gLife--
        elLife.innerText = gLife
        endGame()
        return
    }


    elCell.classList.add('selected');


    console.log(`i: ${i}, j: ${j}`);
    // MODEL

    //DOM

    // Todo Called when a cell (td) is clicked


}

function setMinesNegsCount(board) {
    // Todo Count mines around each cell and set the cell's
    // minesAroundCount
    var noMineCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var negsCount = countNeighbors(i, j, board);
            var currCellPos = { i, j, negsCount };
            var currCell = board[i][j];
            if (!currCell.isMine) {
                noMineCells.push(currCellPos);

            }
        }
    }
    return noMineCells;
}



function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            mat[i][j].isShown = true

            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elCell.innerText = '';
            elCell.classList.add('selected') // מוחק שכנים

            if (mat[i][j]) neighborsCount++;
            if (mat[i][j].isMine) gNeighborsMainCount++;
        }
    }
    console.log('neighborsCount', neighborsCount);
    return neighborsCount;
}

function renderBoard(board) {
    // Todo Render the board as a <table> to the page
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var className = 'cell'
            // if (board[i][j].isShown) className += 'selected'
            if (board[i][j].isMine) strHTML += MINE
            if (board[i][j].isMarked) strHTML += FLAG
            strHTML += `<td data-i="${i}" data-j="${j}"
             title="${i}-${j}" onclick="cellClicked(${i},${j},this,event)"
              class="${className}" class="hide">`
        }
        strHTML += '</td>'
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function createBoard(num = 4) {
    var board = [];
    for (var i = 0; i < num; i++) {
        board.push([]);
        for (var j = 0; j < num; j++) {
            board[i][j] = {
                minesAroundCount: gNeighborsMainCount,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    for (var i = 0; i < gLevel.mines; i++) {
        var randomI = getRandomInt(1, gLevel.size - 1)
        var randomJ = getRandomInt(1, gLevel.size - 1)
        
        if (board[randomI][randomJ].isMine) {
            i--
            continue
        }
        board[randomI][randomJ].isMine = true;
    }
    // setMinesNegsCount(board)
    return board
}

function setTimer() {
    var startTime = Date.now()
    var elModal = document.querySelector('.timer')
    gGameInterval = setInterval(function () {
        var currTime = Date.now()
        var time = ((currTime - startTime) / 1000).toFixed(1)
        elModal.querySelector('span').innerHTML = '🕔 ' + time
    }, 1)
}

