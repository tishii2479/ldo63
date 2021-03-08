let gimmickData;
let selectedTile;
let selectedGimmickIdx = -1;
let isRemoving = false;
let gimmicks;

const H = 200;
const W = 9;
const stage = document.getElementById("stage");
const tilePalette = document.getElementById("tile_palette");
const status = document.getElementById("status");
const create = document.getElementById("create");
const remove = document.getElementById("remove");
const ruler = document.getElementById("ruler");
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
// width = 20x, height = 1x
const gimmickSize = {
    "1": {
        width: 80,
        height: 20,
    },
    "2": {
        width: 180,
        height: 50,
    },
    "3": {
        width: 180,
        height: 20,
    },
    "4": {
        width: 120,
        height: 30,
    },
    "5": {
        width: 40,
        height: 10,
    },
    "6": {
        width: 200,
        height: 30,
    },
    "7": {
        width: 80,
        height: 20,
    },
    "8": {
        width: 360,
        height: 40,
    },
    "9": {
        width: 360,
        height: 20,
    },
    "10": {
        width: 360,
        height: 20,
    },
    "11": {
        width: 180,
        height: 50,
    },
    "12": {
        width: 80,
        height: 20,
    },
    "13": {
        width: 360,
        height: 50,
    },
    "14": {
        width: 360,
        height: 50,
    },
    "15": {
        width: 360,
        height: 20,
    },
    "16": {
        width: 360,
        height: 40,
    },
    "17": {
        width: 360,
        height: 20,
    },
    "18": {
        width: 360,
        height: 20,
    },
    "19": {
        width: 80,
        height: 20,
    },
};
const gimmickConstraints = {
    "1": {
        minX: -8,
        maxX: 8,
    },
    "2": {
        minX: -5,
        maxX: 5,
    },
    "3": {
        minX: -5,
        maxX: 5,
    },
    "4": {
        minX: -7,
        maxX: 7,
    },
    "5": {
        minX: -10,
        maxX: 10,
    },
    "6": {
        minX: -4,
        maxX: 4,
    },
    "7": {
        minX: -8,
        maxX: 8,
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
        minX: -5,
        maxX: 5,
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
setUpRuler();
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
        <img src="image/tile2/${gimmick.id}.png" class="gimmick-img" alt="${gimmick.id}" />
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
    gimmicks = document.getElementsByClassName("gimmick");

    // //マウスが要素内で押されたとき、又はタッチされたとき発火
    // for(let i = 0; i < gimmicks.length; i++) {
    //     gimmicks[i].addEventListener("mousedown", mdown, false);
    //     gimmicks[i].addEventListener("touchstart", mdown, false);
    // }

    // それぞれのギミックにクリックイベントを追加する
    for (let i = 0; i < gimmicks.length; i++) {
        gimmicks[i].addEventListener("click", function () {
            // selectedTile = gimmicks[i].id;
            if (isRemoving == false) { return; }
            gimmickData.splice(i, 1);
            reloadView();
        });
    }

    status.innerHTML = `<p>
        <b>選択中: ${selectedTile}</b>
        </p>
    `;
}

function setUpRuler() {
    let result = "";
    for (let i = 0; i < 19; i++) {
        result += `
            <div class="ruler-block">
                <p>${i * 100}</p>
            </div>
        `;
    }

    ruler.innerHTML = result;
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
        
        console.log(getConstrainedX(selectedTile, x));
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

// ギミックのドラッグ
// https://q-az.net/elements-drag-and-drop/

// //要素内のクリックされた位置を取得するグローバル（のような）変数
// let x;
// let y;

// //マウスが押された際の関数
// function mdown(e) {
//     //クラス名に .drag を追加
//     this.classList.add("drag");

//     //タッチデイベントとマウスのイベントの差異を吸収
//     let event;
//     if (e.type === "mousedown") {
//         event = e;
//     } else {
//         event = e.changedTouches[0];
//     }

//     //要素内の相対座標を取得
//     x = event.pageX - this.offsetLeft;
//     y = event.pageY - this.offsetTop;

//     //ムーブイベントにコールバック
//     document.body.addEventListener("mousemove", mmove, false);
//     document.body.addEventListener("touchmove", mmove, false);
// }

// //マウスカーソルが動いたときに発火
// function mmove(e) {
//     //ドラッグしている要素を取得
//     let drag = document.getElementsByClassName("drag")[0];

//     let event;
//     //同様にマウスとタッチの差異を吸収
//     if(e.type === "mousemove") {
//         event = e;
//     } else {
//         event = e.changedTouches[0];
//     }

//     //フリックしたときに画面を動かさないようにデフォルト動作を抑制
//     e.preventDefault();

//     //マウスが動いた場所に要素を動かす
//     drag.style.top = event.pageY - y + "px";
//     drag.style.left = event.pageX - x + "px";

//     //マウスボタンが離されたとき、またはカーソルが外れたとき発火
//     drag.addEventListener("mouseup", mup, false);
//     drag.addEventListener("touchend", mup, false);
// }

// //マウスボタンが上がったら発火
// function mup(e) {
//     let drag = document.getElementsByClassName("drag")[0];

//     //ムーブベントハンドラの消去
//     document.body.removeEventListener("mousemove", mmove, false);
//     document.body.removeEventListener("touchmove", mmove, false);
//     if (drag) {
//         drag.removeEventListener("mouseup", mup, false);
//         drag.removeEventListener("touchend", mup, false);
//         drag.classList.remove("drag");
//     }
// }
