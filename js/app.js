'use strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ' '

var gBoard
var gGameInterval
var gLife
var gFirstClick

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


var gSoundStartGame = new Audio('sound/start-game.wav')
var gSoundMine = new Audio('sound/mine.mp3')
var gSoundGameOver = new Audio('sound/game-over.wav')
var gSoundWin = new Audio('sound/win.wav')

function init() {
    // play the game 
    gLife = 3
    gGame.isOn = true
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gFirstClick = false
    gBoard = createBoard(gLevel.SIZE)
    renderBoard(gBoard)
    clearInterval(gGameInterval)
    createMine(gBoard, gLevel.MINES)

    document.querySelector('.emoji').innerText = '😄'
    document.querySelector('.time').innerText = '🕔 00:00'
}


function setLevel(size, mines) {
    //  Support 3 levels of the game onclick level
    gLevel['SIZE'] = size
    gLevel['MINES'] = mines
    var elMines = document.querySelector('.bomes')
    elMines.innerText = mines
    restartGame()
}

function restartGame() {
    gLife = 3
    init()
}

function endGame() {
    if (gLife === 0) {
        gSoundGameOver.play()
        showAll(gBoard)
        gGame.isOn = false
        console.log('game over');
        document.querySelector('.emoji').innerText = '😭'

    }
    if (!gGame.isOn) clearInterval(gGameInterval)
    // createMine(gBoard, gLevel.MINES)
}

function checkGameOver() {
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE) {

        document.querySelector('.emoji').innerText = '😎' // win
        restartGame()
    }
    //  LOSE: when clicking a mine, all mines should be revealed
    //  WIN: all the mines are flagged, and all the other cells are shown
}


function cellClicked(i, j, elCell, event) {
    console.log(elCell);
    if (!gGame.isOn) return

    if (!gFirstClick) {
        gFirstClick = true
        gSoundStartGame.play()
        setTimer()
        renderBoard()
        return
    }

    gGame.shownCount++
    gBoard[i][j].isShown = true

    if (event.button === 0) {
        if (gBoard[i][j].isMine) {
            gSoundMine.play()
            document.querySelector('.emoji').innerText = '😕'
            gLevel.MINES--
            gBoard[i][j].isShown = true
            elCell.innerText = MINE
            elCell.style.backgroundColor = "red"
            var elLife = document.querySelector('.life span')
            gLife--
            elLife.innerText = gLife
            endGame()

        }
        // if (gBoard[i][j].minesAroundCount === 0) {
        //     openAllNeighbors(i, j, gBoard, event)
        // }
    }
    if (event.button === 2) {
        // event.preventDefault()
        if (gBoard[i][j].isMarked) {
            gBoard[i][j].isMarked = false;
            gGame.markedCount--
        } else {
            gBoard[i][j].isMarked = true;
            gGame.markedCount++
        }

    }
    // elCell.classList.add('selected')
    checkGameOver()
    renderBoard(gBoard)
}

function renderBoard(board) {
    // Render the board as a <table> to the page
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var className = 'cell'
            var cellContent = ''
            if (board[i][j].isMarked) cellContent = FLAG
            if (board[i][j].isShown) {
                if (board[i][j].isMine) cellContent = MINE
                else cellContent = board[i][j].minesAroundCount
                if (board[i][j].minesAroundCount === 0) cellContent = '. '
            }
            strHTML += `<td data-i="${i}" data-j="${j}"
            oncontextmenu="cellClicked(${i},${j},this,event)"
             onclick="cellClicked(${i},${j},this,event)"
              class="${className}">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

    var Board = document.querySelector('.board') //  rightckick
    Board.addEventListener('contextmenu', e => {
        e.preventDefault()
    })
}

function createBoard(length = 4) {
    var board = [];
    for (var i = 0; i < length; i++) {
        board[i] = [];
        for (var j = 0; j < length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    createMine(board, gLevel.MINES) // creat mine in random place
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
        }
    }
    return board
}

function setMinesNegsCount(board, cellI, cellJ) {
    var count = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}

function createMine(board, num) {
    var count = 0
    for (var i = 0; i < num; i++) {
        var randomI = getRandomInt(1, gLevel.SIZE - 1)
        var randomJ = getRandomInt(1, gLevel.SIZE - 1)

        if (board[randomI][randomJ].isMine) continue

        board[randomI][randomJ].isMine = true
        count++
    }
    return count
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

function showAll(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].isShown = true
        }
    }
    renderBoard(board)
}

