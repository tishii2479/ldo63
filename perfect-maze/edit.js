let csvData;
let selectedTile;
let selectedIndex;
const grid = document.getElementById("grid");
const tilePalette = document.getElementById("tile_palette");
const selected = document.getElementById("selected");
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
    "11",
    "12",
    "13"
];
let tileSize = 40;
const sizes = [30, 35, 40, 45];
const sizeSmall = document.getElementById("size-small");
const sizeMiddle = document.getElementById("size-middle");
const sizeBig = document.getElementById("size-big");
const sizeLarge = document.getElementById("size-large");

setUpToolbar();
setUpSizeButtons();
const toolbarTiles = document.getElementsByClassName("tile-tool");
let grids;

let hasLockedGoal = false;
let hasKey = false;

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

// 画面右のツールバーを設定する
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

// データをアップデートする
// viewを更新する時に呼ぶ
function updateData(data) {
    csvData = convertCSVtoArray(data);
    reloadView();
}

// html要素の作成
// str = 画像番号, x = x座標, y = y座標
function convertStrToElement(str, x, y) {
    if (str == undefined || str == "") { return ""; }
    let width = tileSize, height = tileSize;
    if (x % 2 == 0) {
        width = tileSize * 0.3;
    }
    if (y % 2 == 0) {
        height = tileSize * 0.3;
    }
    return `<div class="tile" style="width: ${width + 1}px; height: ${height + 1}px;">
        <img src="image/tile/${str}.png" class="tile-img" style="width: ${width}px; height: ${height}px;" alt="${str}" />
    </div>`;
}

// csvファイルから配列に変換する
function convertCSVtoArray(str) {
    let result = [];
    let tmp = str.split("\n");
 
    for(let i = 0; i < tmp.length; i++){
        result[i] = tmp[i].split(',');
    }
 
    return result;
}

// 迷路データのアップデート
function reloadView() {
    let h = csvData.length;
    let w = csvData[0].length;
    let result = "";

    // 鍵、鍵付きゴールの状態の更新
    updateKeyConditions();

    // csvData配列からhtml要素を作る
    for (let y = 0; y < h; y++) {
        result += `<div class="grid-row">`
        for (let x = 0; x < w; x++) {
            let isGoalArea = (y == 1 || y == 2) && (x > 0 && x < w - 1);
            if (isGoalArea && hasLockedGoal == false) {
                result += convertStrToElement("-1", x, y);
            } else {
                result += convertStrToElement(csvData[y][x], x, y);
            }
        }
        result += `</div>`
    }

    grid.innerHTML = result;
    grids = document.getElementsByClassName("tile");

    // それぞれのタイルにクリックイベントを追加する
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (grids[y * w + x] == undefined) { continue; }
            grids[y * w + x].addEventListener("click", function () {
                // 選択せずに選んだ時に
                if (selectedTile == undefined) { return; } 
                
                // ゴールエリアは編集できない
                // 鍵付きゴールは例外で設置できる
                let isGoalArea = (y == 1 || y == 2) && (x > 0 && x < w - 1);
                // １列目にギミックを配置できなくする場合にはこっちにする
                // if (isGoalArea && tiles[selectedIndex] != "12") { 
                if (isGoalArea && hasLockedGoal == false && tiles[selectedIndex] != "12") {
                    alert("ゴールエリアは編集できません");
                    return;
                }
                
                // 鍵付きゴールは一列目にのみ配置できる
                if (tiles[selectedIndex] == "12" && isGoalArea == false) {
                    alert("鍵付きゴールは１列目にのみ配置できます。");
                    return;
                }

                // 奇数ますにはギミックを配置できない
                if (selectedIndex > 1 && (x % 2 == 0 || y % 2 == 0)) {
                    alert("奇数ますにはギミックを配置できません");
                    return;
                }

                // 鍵、鍵付きゴールは一つしか設置できない
                if (hasLockedGoal && tiles[selectedIndex] == "12") {
                    alert("鍵付きゴールはステージに一個しか設置できません");
                    return;
                }
                if (hasKey && tiles[selectedIndex] == "13") {
                    alert("鍵はステージに一個しか設置できません");
                    return;
                }

                csvData[y][x] = selectedTile;
                reloadView();
            });
        }
    }
}

// 鍵、鍵付きゴールの状態管理
function updateKeyConditions() {
    let h = csvData.length;
    let w = csvData[0].length;

    hasLockedGoal = false;
    hasKey = false;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (csvData[y][x] == "12") {
                hasLockedGoal = true;
            }
            if (csvData[y][x] == "13") {
                hasKey = true;
            }
        }
    }

    if (hasLockedGoal == false) {
        // 鍵付きゴールがなければ、一行目に設置された鍵をなくす
        for (let x = 0; x < w; x++) {
            if (csvData[1][x] == "13") {
                hasKey = false;
                csvData[1][x] = "0";
            }
        }
    }
}

// タイルの大きさを変えるボタンの設定
function setUpSizeButtons() {
    sizeSmall.addEventListener("click", function () {
        tileSize = sizes[0];
        reloadView();
    });

    sizeMiddle.addEventListener("click", function () {
        tileSize = sizes[1];
        reloadView();
    });

    sizeBig.addEventListener("click", function () {
        tileSize = sizes[2];
        reloadView();
    });

    sizeLarge.addEventListener("click", function () {
        tileSize = sizes[3];
        reloadView();
    });
}

// 再起動した時に確認する
const onBeforeUnloadHandler = function(e) {
    e.returnValue = 'ステージデータのダウンロードを行いましたか？';
};

window.addEventListener('beforeunload', onBeforeUnloadHandler, false);