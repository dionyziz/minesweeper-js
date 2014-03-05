var gameOver = false;
var firstBlock = true;

var field = [];
var visible = [];
var ROWS = 10, COLS = 10, BOMBS = 10;

function inBounds(x, y) {
    return 0 <= x && x < COLS && 0 <= y && y < ROWS;
}

function init() {
    firstBlock = true;

    for (var y = 0; y < ROWS; ++y) {
        field[y] = [];
        visible[y] = [];
        for (var x = 0; x < COLS; ++x) {
            visible[y][x] = 0; 
            if (Math.random() < BOMBS / (COLS * ROWS)) {
                field[y][x] = -1;
            }
            else {
                field[y][x] = 0;
            }
        }
    }

    for (var y = 0; y < ROWS; ++y) {
        for (var x = 0; x < COLS; ++x) {
            if (field[y][x] == 0) {
                var count = 0;
                for (var yy = -1; yy <= 1; ++yy) {
                    for (var xx = -1; xx <= 1; ++xx) {
                        if (xx == 0 && yy == 0) {
                            continue;
                        }
                        if (inBounds(x + xx, y + yy)) {
                            count += field[y + yy][x + xx] == -1;
                        }
                    }
                }
                field[y][x] = count;
            }
        }
    }
}

function fill(x, y) {
    if (field[y][x] == -1 || visible[y][x] == 1) {
        return;
    }
    visible[y][x] = 1;
    if (field[y][x] > 0) {
        return;
    }
    // it's a zero
    for (var yy = -1; yy <= 1; ++yy) {
        for (var xx = -1; xx <= 1; ++xx) {
            if (xx == 0 && yy == 0) {
                continue;
            }
            if (inBounds(x + xx, y + yy)) {
                fill(x + xx, y + yy);
            }
        }
    }
}

function fillAllVictory() {
    for (var y = 0; y < ROWS; ++y) {
        for (var x = 0; x < COLS; ++x) {
            if (field[y][x] >= 0) {
                visible[y][x] = 1;
            } else {
                visible[y][x] = 2;
            }
        }
    }
}

function fillAllDefeat() {
    for (var y = 0; y < ROWS; ++y) {
        for (var x = 0; x < COLS; ++x) {
            visible[y][x] = 1;
        }
    }
}

function openBlock(x, y) {
    if (gameOver) {
        return;
    }
    if (visible[y][x] == 2) {
        return;
    }

    fill(x, y);
    visible[y][x] = 1;
    if (field[y][x] == -1) {
        if (firstBlock) {
            // Avoided bomb!
            init();
            openBlock(x, y);
            return;
        }
        gameOver = true;
        fillAllDefeat();
        stopTimer();
        onGameOver();
    }
    else {
        if (firstBlock) {
            startTimer();
            firstBlock = false;
        }
        if (checkVictory()) {
            gameOver = true;
            fillAllVictory();
            stopTimer();
            onVictory();
        }
    }
}

var timer, secondCount = 0;

function startTimer() {
    timer = setInterval(timerTick, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function checkVictory() {
    for (var y = 0; y < ROWS; ++y) {
        for (var x = 0; x < COLS; ++x) {
            if (field[y][x] != -1 && visible[y][x] != 1) {
                return false;
            }
        }
    }
    return true;
}

function flagBlock(x, y) {
    if (gameOver) {
        return;
    }

    switch (visible[y][x]) {
        case 0:
            visible[y][x] = 2;
            break;
        case 2:
            visible[y][x] = 0;
            break;
    }
}

init();
