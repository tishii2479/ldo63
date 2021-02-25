let stageData;
let selectedIndex;
let selectedTile;

const H = 200;
const W = 9;
const grid = document.getElementById("grid");
const tilePalette = document.getElementById("tile_palette");
const selected = document.getElementById("selected");
const tiles = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
];

setUpToolBar();
updateData("");

function updateData(data) {
    console.log(data);
    stageData = convertJSONtoArray(data);
    reloadView();
}

function convertStrToElement(str) {
    if (str == undefined || str == "") { str = "0"; }
    return `<div class="tile">
        <img src="image/tile/${str}.png" class="tile-img" alt="1" />
    </div>`;
}

function convertJSONtoArray(str) {
    let result = new Array(H);
    for (let y = 0; y < H; y++) {
        result[y] = new Array(W).fill("0");
    }

    // ギミックの配置
    if (str != "") {
        const data = JSON.parse(str);
        const gimmicks = data.gimmicks;

        for (let i = 0; i < gimmicks.length; i++) {
            result[gimmicks[i].z][gimmicks[i].x] = gimmicks[i].id;
        }
    }
    return result;
}

function reloadView() {
    let result = "";

    for (let y = 0; y < H; y++) {
        result += `<div class="grid-row">`;
        for (let x = 0; x < W; x++) {
            result += convertStrToElement(stageData[y][x]);
        }
        result += `</div>`;
    }

    grid.innerHTML = result;
    const grids = document.getElementsByClassName("tile");

    // それぞれのタイルにクリックイベントを追加する
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            if (grids[y * W + x] == undefined) { continue; }
            grids[y * W + x].addEventListener("click", function () {
                // 選択せずに選んだ時に
                if (selectedTile == undefined) { return; } 
                
                stageData[y][x] = selectedTile;
                reloadView();
            });
        }
    }
}

function setUpToolBar() {
    let result = "";
    tiles.forEach(tile => {
        result += `
            <div class="tile-tool" id="${tile}">
                <img class="tile-tool-img" src="image/tile/${tile}.png" alt="${tile}" />
                <p class="tile-tool-text">${tile}</p>
            </div>
        `
    });

    tilePalette.innerHTML = result;

    const toolbarTiles = document.getElementsByClassName("tile-tool");

    for (let i = 0; i < toolbarTiles.length; i++) {
        toolbarTiles[i].addEventListener("click", function () {
            selectedTile = tiles[i];
            selectedIndex = i;
            selected.innerHTML = `<p>
                <b>選択済み: ${tiles[i]}</b>
                </p>
            `;
        });
    }
}