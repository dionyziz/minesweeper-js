var W = 500, H = 500;
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
var colors = {
 '-1': 'red',
    0: 'gray',
    1: 'blue',
    2: 'green',
    3: 'red',
    4: 'navyblue',
    5: 'chocolate',
    6: 'cyan',
    7: 'purple',
    8: 'black'
};

ctx.font = '30px "Trebuchet MS"';

function findTextLocation(x, y, text) {
    return {
        x: (x + 0.5) * BLOCK_W - ctx.measureText(text).width / 2,
        y: (y + 0.5) * BLOCK_H + ctx.measureText('m').width / 2
    };
}

function gameToRenderCoordinates(x, y) {
    return {
        x: x * BLOCK_W,
        y: y * BLOCK_H
    };
}

function drawNumber(x, y, number) {
    var p = findTextLocation(x, y, number);

    ctx.fillStyle = colors[number];
    ctx.fillText(number, p.x, p.y);
}

function drawBox(x, y) {
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W, BLOCK_H);
}


function drawFlag(x, y) {
    var img = document.getElementById('flag');
    var p = gameToRenderCoordinates(x, y);
    ctx.drawImage(img, p.x, p.y, BLOCK_W, BLOCK_H);
}

function drawBomb(x, y) {
    var img = document.getElementById('bomb');
    var p = gameToRenderCoordinates(x, y);
    ctx.drawImage(img, p.x, p.y, BLOCK_W, BLOCK_H);
}

function timerTick() {
    ++secondCount;    
    document.getElementById('timer').innerHTML = timeConvert(secondCount);
}

function timeConvert(seconds) {
    var mins = Math.floor(secondCount / 60);
    var seconds = secondCount % 60;

    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    return mins + ':'  + seconds;
}

function render() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, W, H);

    for (var x = 0; x < COLS; ++x) {
        for (var y = 0; y < ROWS; ++y) {
            if (visible[y][x] == 1) {
                if (field[y][x] == -1) {
                    drawBomb(x, y);
                }
                else {
                    drawNumber(x, y, field[y][x]);
                }
            }
            else if (visible[y][x] == 2) {
                drawFlag(x, y);
            }
            drawBox(x, y);
        }
    }
}

function unproject(x, y) {
    return {
        x: Math.floor((x - canvas.offsetLeft) / BLOCK_W),
        y: Math.floor((y - canvas.offsetTop) / BLOCK_H)
    };
}

document.body.oncontextmenu = function() {
    return false;
};

canvas.onmousedown = function(e) {
    var p = unproject(e.clientX, e.clientY);

    switch (e.button) {
        case 0:
            openBlock(p.x, p.y);
            break;
        case 2:
            flagBlock(p.x, p.y);
            break;
    }

    render();
};

function onGameOver() {
    alert('Game over!');
}

function onVictory() {
    alert('Congratulations! Completed in ' + timeConvert(secondCount));
}

render();
