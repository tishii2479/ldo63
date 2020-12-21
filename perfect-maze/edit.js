let csvData;
let selectedTile;
const grid = document.getElementById("grid");
const tilePalette = document.getElementById("tile_palette");
const tiles = [
    "0",
    "1",
    "3",
    "4",
    "5",
    "6_1", "6_2", "6_3", "6_4",
    "7",
    "8_1", "8_2", "8_3", "8_4",
    "9_0", "9_1",
    "10_1", "10_2",
    "11"
];

setUpToolbar();
const toolbarTiles = document.getElementsByClassName("tile-tool");
let grids;

for (let i = 0; i < toolbarTiles.length; i++) {
    toolbarTiles[i].addEventListener("click", function () {
        selectedTile = tiles[i];
        console.log(selectedTile);
    });
}

function setUpToolbar() {
    let result = "";
    tiles.forEach(tile => {
        result += `
            <div class="tile-tool" id="${tile}">
                <img class="tile-tool-img" src="image/tile/${tile}.png" alt="${tile}" />
                <p class="tile-tool-text">${tile}</p>
            </div>
        `;
    });

    tilePalette.innerHTML = result;
}

function updateData(data) {
    console.log("updated data");
    csvData = convertCSVtoArray(data);
    reloadView();
}

function convertStrToElement(str) {
    if (str == undefined || str == "") { return ""; }
    return `<div class="tile">
        <img src="image/tile/${str}.png" class="tile-img" alt="${str}" />
    </div>`;
}

function convertCSVtoArray(str) {
    let result = [];
    let tmp = str.split("\n");
 
    for(let i = 0; i < tmp.length; i++){
        result[i] = tmp[i].split(',');
    }
 
    return result;
}

function reloadView() {
    let h = csvData.length;
    let w = csvData[0].length;
    let result = "";
    for (let y = 0; y < h; y++) {
        result += `<div class="grid-row">`
        for (let x = 0; x < w; x++) {
            result += convertStrToElement(csvData[y][x]);
        }
        result += `</div>`
    }

    grid.innerHTML = result;

    grids = document.getElementsByClassName("tile");

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (grids[y * w + x] == undefined) { console.log(y * w + x); continue;}
            grids[y * w + x].addEventListener("click", function () {
                if (x % 2 == 0 || y % 2 == 0) {
                    alert("奇数ますにはギミックを配置できません");
                    return;
                }
                csvData[y][x] = selectedTile;
                reloadView();
            });
        }
    }
}

// const onBeforeUnloadHandler = function(e) {
//     e.returnValue = 'ステージデータのダウンロードを行いましたか？';
// };

// window.addEventListener('beforeunload', onBeforeUnloadHandler, false);