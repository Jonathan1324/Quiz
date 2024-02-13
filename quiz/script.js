// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyA4teXf__R7A81Kkaf1AffDqb1fEPnsdMo",
    authDomain: "quiz-7c77c.firebaseapp.com",
    projectId: "quiz-7c77c",
    storageBucket: "quiz-7c77c.appspot.com",
    messagingSenderId: "708757388085",
    appId: "1:708757388085:web:08ba812b73491e7c54ea7c",
    measurementId: "G-Q11CP6XDR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

let quizID = sessionStorage.getItem("id");
let rightOption = 0;

let quiz = (await getDoc(doc(db, "Quizes", quizID)));
quiz = quiz.data(quizID = quizID);

let choosen = false;

let current = 1;
let score = 0;

function load(question){
    try{
        document.getElementById("nextBtn").innerHTML = "next";
        rightOption = quiz["questions"][question]["right"];
    } catch(e){
        if(current >= 0){
            document.getElementById("question").innerHTML = `
                <h1 id="Question">Quiz not found</h1>
            `;
            document.getElementById("nextBtn").innerHTML = "back";
            current = -1;
            return;
        }
    }
    
    let options = [1, 2, 3, 4];

    options.sort(() => Math.random() - 0.5);
    
    document.getElementById("question").innerHTML = `
        <h1 id="Question">${document.getElementById("Question").innerHTML = quiz["questions"][question]["title"]}</h1>
        <br>
        <table id="options">
            <tr class="optionRow">
                <th class="optionColumn" id="option${options[0]}" onclick="choose(${options[0]})">${quiz["questions"][question][options[0]]}</th>
                <th class="optionColumn" id="option${options[1]}" onclick="choose(${options[1]})">${quiz["questions"][question][options[1]]}</th>
            </tr>
            <tr class="optionRow">
                <th class="optionColumn" id="option${options[2]}" onclick="choose(${options[2]})">${quiz["questions"][question][options[2]]}</th>
                <th class="optionColumn" id="option${options[3]}" onclick="choose(${options[3]})">${quiz["questions"][question][options[3]]}</th>
            </tr>
        </table>
    `;

    rightOption = quiz["questions"][question]["right"];
}

function finished(){
    current++;
    document.getElementById("question").innerHTML = `
        <h1 id="Question">${document.getElementById("Question").innerHTML = quiz["title"]}</h1>
        <h2>by <a href="${window.location.href.substring(0, window.location.href.lastIndexOf('/quiz'))}/Account/user/?id=${quiz["creator"]}" style="text-decoration: none; color:white;">${quiz["creatorName"]}</a></h2>
        <br>
        <h1 id="score">${score}</h1>
    `;
}

load(current);

window.choose = function (selection) {
    if(choosen){ return; }

    eval(`
    document.getElementById("option${selection}").style.backgroundColor = 'rgb(255, 0, 0)';
    document.getElementById("option${rightOption}").style.backgroundColor = 'rgb(0, 255, 0)';
    `);

    if(selection == rightOption){
        score++;
    }

    choosen = true;
    if(current<parseInt(quiz["questionCount"])){
        current++;
    } else {
        current = -2;
    }
}

window.next = function () {
    console.log(current)
    try{
        load(current);
    } catch (e){}
    choosen = false;
    if(current == -2){
        finished();
    } else if(current == -1){
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/quiz'));
    }
}