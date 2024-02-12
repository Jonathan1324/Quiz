// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
const db = getFirestore(app);

let quizID = "123";
let quiz = {};
let questions = {};

let currentQuestion = 1;

function loadQuestions(){
    let list = document.getElementById("questions");

    list.innerHTML = "";

    for(let i = 1; i < Object.keys(questions).length + 1; i++){
        list.innerHTML += `<li> ${questions[i]["title"]} <button id="destroyButton" onclick="deleteQuestion(${i})">X</button> </li>`
    }
}

window.createQuiz = async function() {
    quizID = await getDoc(doc(db, "Metadata", "Quizes"));
    quizID = quizID.data()["newestQuizID"] + 1;

    quiz = {"title": document.getElementById("titleInput").value, "questions": questions, "questionCount": Object.keys(questions).length};

    await setDoc(doc(db, "Metadata", "Quizes"), {"newestQuizID": quizID});
    await setDoc(doc(db, "Quizes", String(quizID)), quiz);

    document.getElementById("quizTitle").innerHTML = "";
    document.getElementById("Table").innerHTML = "ID: " + quizID;
}

window.deleteQuestion = function(Delete) {
    let newQuestions = {};
    let Count = 0;
    for(let i = 1; i < Object.keys(questions).length + 1; i++){
        console.log("T");
        if(i != Delete){ 
            Count++;
            newQuestions[Count] = questions[i];
        }
    }
    questions = newQuestions;
    console.log(questions);
    currentQuestion--;
    loadQuestions();
}

window.saveQuestion = function() {
    questions[String(currentQuestion)] = {
        title: document.getElementById("questionInput").value,
        1: document.getElementById("answerInput1").value,
        2: document.getElementById("answerInput2").value,
        3: document.getElementById("answerInput3").value,
        4: document.getElementById("answerInput4").value,
        right: document.getElementById("rightAnswer").options[document.getElementById("rightAnswer").selectedIndex].value
    };

    document.getElementById("questionInput").value = "";
    document.getElementById("answerInput1").value = "";
    document.getElementById("answerInput2").value = "";
    document.getElementById("answerInput3").value = "";
    document.getElementById("answerInput4").value = "";

    loadQuestions();

    currentQuestion++;
}

window.clearQuestions = function() {
    questions = {};
    try {
        loadQuestions();
    } catch(e){}
    currentQuestion = 1;
}