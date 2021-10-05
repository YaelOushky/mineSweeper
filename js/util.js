'use strict'
// פונקציית שכנים
function checkCount(mat, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        // not outside mat
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            // not outside mat
            if (j < 0 || j > mat[0].length - 1) continue;

            // not on selected pos
            if (i === rowIdx && j === colIdx) continue;
            if (mat[i][j] === '$') count++;
        }
    }
    return count;

}

function getRandomInt(min, max){
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1) + min);
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(i, j, value) {
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.innerHTML = value;
}