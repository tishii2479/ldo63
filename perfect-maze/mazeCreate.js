// 地図の2次元配列の辺縁を厚みが3枡分のtrue(壁)で埋める。
let mapArrayWidth = 21;
let mapArrayHeight = 21;
let mapArray = []; // 行、列の2次元配列。

function createMaze()
{
    initialize();
    
    let i = 0;
    let j = 0;
    for( i = 0; i < mapArrayWidth; i++ )
    {
        mapArray[0][i] = 1;
        mapArray[1][i] = 1;
        mapArray[2][i] = 1;
        mapArray[mapArrayHeight - 3][i] = 1;
        mapArray[mapArrayHeight - 2][i] = 1;
        mapArray[mapArrayHeight - 1][i] = 1;
    }

    for( i = 2; i < mapArrayHeight - 2; i++ )
    {
        mapArray[i][0] = 1;
        mapArray[i][1] = 1;
        mapArray[i][2] = 1;
        mapArray[i][mapArrayWidth - 3] = 1;
        mapArray[i][mapArrayWidth - 2] = 1;
        mapArray[i][mapArrayWidth - 1] = 1;
    }

    // 壁延ばし法により迷路を生成する。

    let mapQue = []; // 行、列の2要素の1次元配列のキュー。
    for( i = 2; i < mapArrayHeight - 2; i += 2 )
    {
        for( j = 2; j < mapArrayWidth - 2; j += 2 )
        {
            // 壁かつ探索可能な枡目を記録する。
            if( mapArray[i][j] === 1 )
            {
            mapQue.push( [i, j] );
            }
        }
    }

    let loopFlag = true;
    let loopCounter = 0;
    let maxCountOfLoop = Math.pow(4, 5) * 0.1;
    let randomNumber = 0;
    let k = 0;
    let l = 0;
    while( mapQue.length > 0 && loopCounter < maxCountOfLoop )
    {
        // 始点を置く。
        randomNumber = Math.floor( Math.random() * mapQue.length );
        i = mapQue[randomNumber][0];
        j = mapQue[randomNumber][1];
        mapQue.splice( randomNumber, 1 ); // 探索済みの座標を削除する。

        loopFlag = true;
        while( loopFlag === true )
        {
            if( mapArray[i][j] === 1 && (mapArray[i - 2][j] === 0 || mapArray[i][j - 2] === 0 || mapArray[i][j + 2] === 0 || mapArray[i + 2][j] === 0) )
            // その枡目が壁であり、かつ上下左右の内いずれかの方向の2枡先が空間ならば以下の処理を実行する。
            {
                mapQue.push( [i, j] ); // 壁にした座標をキューに追加する。

                k = Math.floor( Math.random() * 4 );
                if( k === 0 && mapArray[i - 2][j] === 0 )
                {
                    mapArray[i - 1][j] = 1;
                    mapArray[i - 2][j] = 1;
                    i -= 2;
                }else if( k === 1 && mapArray[i][j - 2] === 0 )
                {
                    mapArray[i][j - 1] = 1;
                    mapArray[i][j - 2] = 1;
                    j -= 2;
                }else if( k === 2 && mapArray[i][j + 2] === 0 )
                {
                    mapArray[i][j + 1] = 1;
                    mapArray[i][j + 2] = 1;
                    j += 2;
                }else if( k === 3 && mapArray[i + 2][j] === 0 )
                {
                    mapArray[i + 1][j] = 1;
                    mapArray[i + 2][j] = 1;
                    i += 2;
                }
            }else
            {
                loopFlag = false;
            }
        }
        loopCounter++;  
    }
    
    convertMapArrayToCSV(mapArray)
}

function convertMapArrayToCSV(mapArray) {
    let result = ""
    for (let y = 2; y < mapArrayHeight - 2; y++) {
        for (let x = 2; x < mapArrayWidth - 2; x++) {
            if (mapArray[y][x] == 0) {
                result += "0,";
            } else {
                result += "1,";
            }
        }
        result += "\n";
    }

    updateData(result);
}

// 初期化する為の関数を宣言する。
function initialize()
{
    // 変数を初期化する。
    mapArrayWidth = 25;
    mapArrayHeight = 25;

    // 迷路の2次元配列をfalse(空間)で埋めて初期化する。
    let i = 0;
    let j = 0;
    for( i = 0; i < mapArrayHeight; i++ )
    {
        mapArray[i] = [];
        for( j = 0; j < mapArrayWidth; j++ )
        {
            mapArray[i][j] = 0;
        }
    }
}

const create = document.getElementById("create");
create.addEventListener('click', createMaze);