'use strict'


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