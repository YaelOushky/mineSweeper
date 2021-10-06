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
    gGame.shownCount = 0
    gGame.markedCount = 0
    gFirstClick = false
    // gLevel.MINES = 2 
    // gLevel.SIZE = 4 
    // setLevel(gLevel.SIZE,  gLevel.MINES)

    document.querySelector('.emoji').innerText = '😄'
    document.querySelector('.time').innerText = '🕔 00:00'
    document.querySelector('.life span').innerText = gLife
    document.querySelector('.mine span').innerText = gLevel.MINES

    clearInterval(gGameInterval)
    gBoard = createBoard(gLevel.SIZE)
    renderBoard(gBoard)
}


function checkLose() {
    //  LOSE: when clicking a mine, all mines should be revealed
    if (gLife === 0) {
        gSoundGameOver.play()
        showAll(gBoard)
        gGame.isOn = false
        document.querySelector('.emoji').innerText = '😭'
    }
    if (!gGame.isOn) {
        showAll(gBoard)

    }
}

function checkVictory(i, j) {
    //  WIN: all the mines are flagged, and all the other cells are shown

    var emptyCellsNum = gLevel.SIZE * gLevel.SIZE - gLevel.MINES // 14/52/114
    if (gGame.shownCount === emptyCellsNum && gGame.markedCount === gLevel.MINES || !gLevel.MINES || gBoard[i][j].isMine && gBoard[i][j].isMarked && gGame.markedCount === gLevel.MINES) {

        document.querySelector('.emoji').innerText = '😎' // win
        gSoundWin.play()
        gGame.isOn = false

    }
}

function setLevel(size, mines) {
    //  Support 3 levels of the game onclick level
    gLevel['SIZE'] = size
    gLevel['MINES'] = mines
    var elMines = document.querySelector('.bomes')
    elMines.innerText = mines
    init()
}

function expandShown(board, elCell, i, j) {
    var neighbors = []
    var cellI = i
    var cellJ = j
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (gBoard[i][j].isMarked || gBoard[i][j].isMine) continue
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isShown) {
                neighbors.push({ i: i, j: j })
            }
            if (!gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true
                gGame.shownCount++
            }
        }
    }

}

function cellMarked(i, j, elCell, event) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked  //toggle
    if (gBoard[i][j].isMarked) {
        gGame.markedCount++
        elCell.innerText = FLAG
    } else {
        gBoard[i][j].isMarked = true;
        gGame.markedCount--
        elCell.innerText = EMPTY
    }
    checkVictory(i, j)
    checkLose()
}

function cellClicked(i, j, elCell, event) {
    if (!gGame.isOn) return

    if (!gFirstClick) {
        gFirstClick = true
        gGame.shownCount++
        gSoundStartGame.play()
        setTimer()
        renderBoard(gBoard)
        // createMine(gBoard, gLevel.MINES)
        return
    }
    gGame.shownCount++
    gBoard[i][j].isShown = true

    if (event.button === 0) {
        if (gBoard[i][j].isMine) {
            gBoard[i][j].isShown = true
            elCell.innerText = MINE
            var elLife = document.querySelector('.life span')
            gLife--
            elLife.innerText = gLife
            var elMines = document.querySelector('.mine span')
            gLevel.MINES--
            elMines.innerText = gLevel.MINES
            elCell.style.backgroundColor = "red"
            gSoundMine.play()
            document.querySelector('.emoji').innerText = '😕'
            checkLose()
        }
    }
    if (event.button === 2) cellMarked(i, j, elCell, event)

    if (gBoard[i][j].minesAroundCount === 0) expandShown(gBoard, elCell, i, j)

    checkVictory(i, j)
    checkLose()
    renderBoard(gBoard)
}

function renderBoard(board) {
    // Render the board as a <table> to the page
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var className = 'cell'
            var cellContent = ' '
            if (board[i][j].isShown) {
                if (board[i][j].isMine) cellContent = MINE
                else cellContent = board[i][j].minesAroundCount

                if (board[i][j].minesAroundCount === 0) cellContent = '.'
            }
            if (board[i][j].isMarked) cellContent = FLAG
            strHTML += `<td data-i="${i}" data-j="${j}"
            oncontextmenu="cellMarked(${i},${j},this,event); return false;"
             onclick="cellClicked(${i},${j},this,event)"
              class="${className}">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

    var Board = document.querySelector('.board') //  right click
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
    console.log('num is', num,);
    for (var i = 0; i < num; i++) {
        var randomI = getRandomInt(1, gLevel.SIZE - 1)
        var randomJ = getRandomInt(1, gLevel.SIZE - 1)

        if (board[randomI][randomJ].isMine) {
            num--
            continue
        }

        board[randomI][randomJ].isMine = true
        count++
    }
    gLevel.MINES = count
    console.log('count is', count);
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

