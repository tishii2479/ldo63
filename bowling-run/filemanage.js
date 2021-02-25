// upload file
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const download = document.getElementById('download');
const fileNameInput = document.getElementById('fileNameInput');
let fileName = "";

dropZone.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.background = '#e1e7f0';
}, false);

dropZone.addEventListener('dragleave', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.background = '#ffffff';
}, false);

fileInput.addEventListener('change', function () {
    uploadFile(this.files[0]);
});

dropZone.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.background = '#ffffff';
    let files = e.dataTransfer.files;
    if (files.length > 1) return alert('アップロードできるファイルは1つだけです。');
    fileInput.files = files;
    uploadFile(files[0]);
}, false);

function uploadFile(file) {
    const fr = new FileReader();
    fr.readAsText(file);
    if (fileName != "") {
        if (confirm("前のステージデータはダウンロードしましたか？") == false) {
            return;
        }
    }
    let type = file.name.split('.');
    
    if (type[type.length - 1].toLowerCase() != 'json') {
        alert('拡張子がjsonであるファイルのみアップロードできます。');
        return;
    }

    fileName = file.name;

    fr.onload = function () {
        console.log("upload data");
        console.log(fr.result);
        updateData(fr.result);
    };
}

function downloadFile() {
    let fileName = fileNameInput.value;
    if (fileName == "") {
        fileName = "stage.json"
    }
    let data = convertStageDataToJSON();

    console.log("download data");
    console.log(data);

    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, data], { type: "text/json" });

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, fileName);
    } else {
        const url = (window.URL || window.webkitURL).createObjectURL(blob);
        const download = document.createElement("a");
        download.href = url;
        download.download = fileName;
        download.click();
        (window.URL || window.webkitURL).revokeObjectURL(url);
    }
}

download.addEventListener("click", downloadFile, false);

function convertStageDataToJSON() {
    const gimmicksElements = document.getElementsByClassName("gimmick"); 
    let gimmicks = [];
    for (let i = 0; i < gimmicksElements.length; i++) {
        gimmicks.push(
            {
                id: gimmicksElements[i].id,
                x: Math.round(4 * (gimmicksElements[i].offsetLeft + gimmickSize[gimmicksElements[i].id].width / 2 - 180) / 180),
                z: gimmicksElements[i].offsetTop + gimmickSize[gimmicksElements[i].id].height / 2,
                option: ""
            }
        );
    }

    return JSON.stringify({
        type: "basic",
        gimmicks: gimmicks
    });
}