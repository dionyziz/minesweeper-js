var field = [];
var ROWS = 10, COLS = 10, BOMBS = 10;
var W = 500, H = 500;

function inBounds(x, y) {
    return 0 <= x && x < COLS && 0 <= y && y < ROWS;
}

function init() {
    for (var y = 0; y < ROWS; ++y) {
        field[y] = [];
        for (var x = 0; x < COLS; ++x) {
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

    console.log(field);
}

init();
render();

function drawNumber(x, y, number) {
    ctx.drawText(x, y, number);
}

function render() {
    for (var x = 0; x < COLS; ++x) {
        for (var y = 0; y < ROWS; ++y) {
            drawNumber(x, y, field[y][x]);
        }
    }
}
