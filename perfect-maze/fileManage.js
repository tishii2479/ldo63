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
    
    if (type[type.length - 1].toLowerCase() != 'csv') {
        alert('拡張子がcsvであるファイルのみアップロードできます。');
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
        fileName = "stage.csv"
    }
    let data = "";
    if (csvData == undefined) {
        alert("data not set");
        return;
    }

    for (let i = 0; i < csvData.length; i++) {
        data += csvData[i].toString();

        if (i < csvData.length - 1) {
            data += "\n";
        }
    }

    console.log("download data");
    console.log(data);

    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, data], { type: "text/csv" });

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
