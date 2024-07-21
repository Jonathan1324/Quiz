// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

let User = "";
let UName = "";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let quizID = "0";
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
    document.getElementById("createQuiz").innerHTML = "Loading";
    quizID = await getDoc(doc(db, "Metadata", "Quizes"));
    quizID = quizID.data()["newestQuizID"] + 1;

    quiz = {
    
        "creator": User,
        "creatorName": UName,
        "language": document.getElementById("languages").value,
        "questionCount": Object.keys(questions).length,
        "questions": questions,
        "title": document.getElementById("titleInput").value
    };

    await updateDoc(doc(db, "Metadata", "Quizes"), {"newestQuizID": quizID});
    await setDoc(doc(db, "Quizes", String(quizID)), quiz);

    document.getElementById("quizTitle").innerHTML = "";
    document.getElementById("Table").innerHTML = "ID: " + quizID;
    document.getElementById("createQuiz").innerHTML = "";
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
        right: document.getElementById("rightAnswer").options[document.getElementById("rightAnswer").selectedIndex].value,
        createdAt: Date.now(),
        type: 1
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

await onAuthStateChanged(auth, (user) => {
    if (!user) { 
        document.getElementById("createQuiz").innerHTML = "";
    } else {
        User = user.uid;
        UName = user.displayName;
        document.getElementById("createQuiz").innerHTML = `<button onclick="createQuiz()">Create Quiz</button>`;
    }
});