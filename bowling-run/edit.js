let gimmickData;
let selectedIndex;
let selectedTile;
let selectedGimmickIdx = -1;
let isRemoving = false;

const H = 200;
const W = 9;
const stage = document.getElementById("stage");
const tilePalette = document.getElementById("tile_palette");
const status = document.getElementById("status");
const create = document.getElementById("create");
const remove = document.getElementById("remove");
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
const gimmickSize = {
    "1": {
        width: 80,
        height: 60,
    },
    "2": {
        width: 180,
        height: 120,
    },
    "3": {
        width: 180,
        height: 60,
    },
    "4": {
        width: 80,
        height: 60,
    },
    "5": {
        width: 40,
        height: 30,
    },
    "6": {
        width: 200,
        height: 60,
    },
    "7": {
        width: 80,
        height: 60,
    },
    "8": {
        width: 360,
        height: 40,
    },
    "9": {
        width: 360,
        height: 40,
    },
    "10": {
        width: 360,
        height: 40,
    },
    "11": {
        width: 180,
        height: 120,
    },
    "12": {
        width: 80,
        height: 60,
    },
    "13": {
        width: 360,
        height: 120,
    },
    "14": {
        width: 360,
        height: 120,
    },
    "15": {
        width: 360,
        height: 60,
    },
    "16": {
        width: 360,
        height: 40,
    },
    "17": {
        width: 360,
        height: 40,
    },
    "18": {
        width: 360,
        height: 40,
    },
    "19": {
        width: 80,
        height: 60,
    },
};
const gimmickConstraints = {
    "1": {
        minX: -7,
        maxX: 7,
    },
    "2": {
        minX: -4,
        maxX: 4,
    },
    "3": {
        minX: -4,
        maxX: 4,
    },
    "4": {
        minX: -7,
        maxX: 7,
    },
    "5": {
        minX: -8,
        maxX: 8,
    },
    "6": {
        minX: -4,
        maxX: 4,
    },
    "7": {
        minX: -7,
        maxX: 7,
    },
    "8": {
        minX: 0,
        maxX: 0,
    },
    "9": {
        minX: 0,
        maxX: 0,
    },
    "10": {
        minX: 0,
        maxX: 0,
    },
    "11": {
        minX: -4,
        maxX: 4,
    },
    "12": {
        minX: -7,
        maxX: 7,
    },
    "13": {
        minX: 0,
        maxX: 0,
    },
    "14": {
        minX: 0,
        maxX: 0,
    },
    "15": {
        minX: 0,
        maxX: 0,
    },
    "16": {
        minX: 0,
        maxX: 0,
    },
    "17": {
        minX: 0,
        maxX: 0,
    },
    "18": {
        minX: 0,
        maxX: 0,
    },
    "19": {
        minX: -7,
        maxX: 7,
    },
}

setUpToolBar();
setUpStage();
updateData("");

function updateData(data) {
    gimmickData = convertJSONtoArray(data);
    reloadView();
}

function convertGimmickToElement(gimmick) {
    if (gimmick == undefined) { return; }
    let top = gimmick.z;
    let left = gimmick.x;
    let width = gimmickSize[gimmick.id].width;
    let height = gimmickSize[gimmick.id].height;
    return `<div class="gimmick" id="${gimmick.id}" style="top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px">
        <img src="image/tile/${gimmick.id}.png" class="gimmick-img" alt="${gimmick.id}" />
    </div>`;
}

function convertJSONtoArray(str) {
    let result = [];
    // ギミックの配置
    if (str != "") {
        const data = JSON.parse(str);
        const gimmicks = data.gimmicks;

        for (let i = 0; i < gimmicks.length; i++) {
            let gimmick = gimmicks[i];
            let x = 180 * gimmick.x / 4 + 180;
            gimmick.x = getConstrainedX(gimmicks[i].id, x);
            gimmick.z -= gimmickSize[gimmick.id].height / 2;
            result.push(gimmicks[i]);
        }
    }
    return result;
}

function reloadView() {
    let result = "";

    for (let i = 0; i < gimmickData.length; i++) {
        result += convertGimmickToElement(gimmickData[i]);
    }

    stage.innerHTML = result;
    const gimmicks = document.getElementsByClassName("gimmick");

    // それぞれのギミックにクリックイベントを追加する
    for (let i = 0; i < gimmicks.length; i++) {
        gimmicks[i].addEventListener("click", function () {
            if (isRemoving == false) { return; }
            gimmickData.splice(i, 1);
            reloadView();
        });
    }
}

function setUpStage() {
    stage.addEventListener("click", function (event) {
        if (selectedTile == "" || selectedTile == undefined) { return; }
        if (isRemoving) { return; }

        let clickX = event.pageX;
        let clickY = event.pageY;

        // 要素の位置を取得
        let clientRect = this.getBoundingClientRect();
        let positionX = clientRect.left + window.pageXOffset;
        let positionY = clientRect.top + window.pageYOffset;

        // 要素内におけるクリック位置を計算
        let x = clickX - positionX;
        let y = clickY - positionY;

        gimmickData.push({
            id: selectedTile,
            x: getConstrainedX(selectedTile, x),
            z: y - gimmickSize[selectedTile].height / 2,
            option: ""
        });
        reloadView();
    });
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
            isRemoving = false;
            status.innerHTML = `<p>
                <b>選択中: ${tiles[i]}</b>
                </p>
            `;
        });
    }
}

function createNew() {
    if (confirm("前のステージデータはダウンロードしましたか？") == false) {
        return;
    }
    updateData("");
}

function toggleRemove() {
    isRemoving = !isRemoving;
    if (isRemoving) {
        status.innerHTML = "<b style='color: red;'>削除中</b>";
    }
}

function getConstrainedX(tile, x) {
    return Math.max(
        Math.min(
            gimmickConstraints[tile].maxX * 20 + 180 - gimmickSize[tile].width / 2,
            x - gimmickSize[tile].width / 2
        ),
        gimmickConstraints[tile].minX * 20 + 180 - gimmickSize[tile].width / 2
    );
}

create.addEventListener("click", createNew);
remove.addEventListener("click", toggleRemove);

// 再起動した時に確認する
const onBeforeUnloadHandler = function (e) {
    e.returnValue = 'ステージデータのダウンロードを行いましたか？';
};

window.addEventListener('beforeunload', onBeforeUnloadHandler, false);