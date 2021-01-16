const questionText = document.getElementById("question_text");
const courseNumber = document.getElementById("course_number");
const answerText = document.getElementById("answer_text");
const showAnswerBtn = document.getElementById("show_answer_btn");
const prevBtn = document.getElementById("prev_btn");
const nextBtn = document.getElementById("next_btn");

// 問題リスト
let questionList = [];
let nowQuestion = 0; 

getCSV();

function loadQuestion() {
    courseNumber.innerText = questionList[nowQuestion][0];
    questionText.innerText = questionList[nowQuestion][1];
    answerText.innerText = "";
}

prevBtn.addEventListener("click", function () {
    nowQuestion -= 1;
    nowQuestion = Math.max(0, nowQuestion);
    loadQuestion(nowQuestion);
});

nextBtn.addEventListener("click", function () {
    nowQuestion += 1;
    nowQuestion = Math.min(nowQuestion, questionList.length);
    loadQuestion(nowQuestion);
});

showAnswerBtn.addEventListener("click", function () {
    let answer = questionList[nowQuestion][2];
    if (answer == "1") {
        answerText.innerText = "正解";
    } else {
        answerText.innerText = "不正解";
    }
});

function getCSV() {
    let req = new XMLHttpRequest();
    req.open("get", "test.csv", true);
    req.send(null); 
	
    req.onload = function() {
	    convertCSVtoArray(req.responseText);
    }
}
 
function convertCSVtoArray(str) {
    let result = [];
    let tmp = str.split("\n");
 
    for(let i = 0; i < tmp.length; ++i){
        result[i] = tmp[i].split(',');
    }
    
    questionList = result;

    loadQuestion(nowQuestion);
}