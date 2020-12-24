// 地図の2次元配列の辺縁を厚みが3枡分のtrue(壁)で埋める。
let mapArrayWidth = 21;
let mapArrayHeight = 21;
let mapArray = []; // 行、列の2次元配列。

const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
let stack = [];
const PATH = 0;
const WALL = 1;

function createMaze()
{
    // 0 = path
    // 1 = wall
    let w = widthInput.value - 0;
    let h = heightInput.value - 0;

    // check input
    if (w < 10 || h < 10) {
        alert("width, heightは10以上の値でないといけません");
        return;
    }

    if (w > 100 || h > 100) {
        alert("width, heightは100より小さい値でないといけません");
        return;
    }

    if (h % 2 != 1 || w % 2 != 1) {
        alert("width, heightは奇数でないといけません");
        return;
    }

    mapArrayWidth = w;
    mapArrayHeight = h;

    if (fileName != "") {
        if (confirm("前のステージデータはダウンロードしましたか？") == false) {
            return;
        }
    }

    fileName = "stage.csv"

    initialize();

    let startCells = [];
    
    for (let y = 0; y < mapArrayHeight; y++) {
        for (let x = 0; x < mapArrayWidth; x++) {
            if (x == 0 || y == 0 || x == mapArrayWidth - 1 || y == mapArrayHeight - 1) {
                mapArray[y][x] = WALL;
            } else {
                mapArray[y][x] = PATH;
                if (x % 2 == 0 && y % 2 == 0) {
                    startCells.push([y, x]);
                }
            }
        }
    }

    while (startCells.length > 0) {
        let index = getRandomInt(startCells.length);
        let cell = startCells[index];
        startCells.splice(index, 1);
        let x = cell[1];
        let y = cell[0];

        if (mapArray[y][x] == PATH) {
            stack = [];
            extendWall(x, y);
        }
    }
    
    convertMapArrayToCSV(mapArray)
}

function extendWall(x, y) {
    const UP = 0;
    const RIGHT = 1;
    const DOWN = 2;
    const LEFT = 3;
    let directions = [];

    if (mapArray[y - 1][x] == PATH && isCurrentWall(x, y - 2) == false) {
        directions.push(UP);
    }
    if (mapArray[y][x + 1] == PATH && isCurrentWall(x + 2, y) == false) {
        directions.push(RIGHT);
    }
    if (mapArray[y + 1][x] == PATH && isCurrentWall(x, y + 2) == false) {
        directions.push(DOWN);
    }
    if (mapArray[y][x - 1] == PATH && isCurrentWall(x - 2, y) == false) {
        directions.push(LEFT);
    }

    if (directions.length > 0) {
        setWall(x, y);

        let isPath = false;
        let dirIndex = getRandomInt(directions.length);
        switch (directions[dirIndex]) {
            case UP:
                isPath = (mapArray[y - 2][x] == PATH);
                setWall(x, --y);
                setWall(x, --y);
                break;
            case RIGHT:
                isPath = (mapArray[y][x + 2] == PATH);
                setWall(++x, y);
                setWall(++x, y);
                break;
            case DOWN:
                isPath = (mapArray[y + 2][x] == PATH);
                setWall(x, ++y);
                setWall(x, ++y);
                break;
            case LEFT:
                isPath = (mapArray[y][x - 2] == PATH);
                setWall(--x, y);
                setWall(--x, y);
                break;
        }
        if (isPath) {
            extendWall(x, y);
        }
    } else {
        let beforeCell = stack.pop();
        extendWall(beforeCell[1], beforeCell[0]);
    }
}

function setWall(x, y) {
    mapArray[y][x] = 1;
    if (x % 2 == 0 && y % 2 == 0) {
        stack.push([y, x]);
    }
}

function isCurrentWall(x, y) {
    for (let i = 0; i < stack.length; i++) {
        if (y == stack[i][0] && x == stack[i][1]) {
            return true;
        }
    }
    return false;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function convertMapArrayToCSV(mapArray) {
    console.log(mapArray);
    let result = ""
    for (let y = 0; y < mapArrayHeight; y++) {
        for (let x = 0; x < mapArrayWidth; x++) {
            if (mapArray[y][x] == PATH) {
                result += "0";
            } else {
                result += "1";
            }
            if (x < mapArrayWidth - 1) { 
                result += ",";
            }
        }
        if (y < mapArrayHeight - 1) {
            result += "\n";
        }
    }
    result = result.trim();

    updateData(result);
}

// 初期化する為の関数を宣言する。
function initialize()
{
    // 迷路の2次元配列をfalse(空間)で埋めて初期化する。
    let i = 0;
    let j = 0;
    for( i = 0; i < mapArrayHeight; i++ )
    {
        mapArray[i] = [];
        for( j = 0; j < mapArrayWidth; j++ )
        {
            mapArray[i][j] = PATH;
        }
    }
}

const create = document.getElementById("create");
create.addEventListener('click', createMaze);