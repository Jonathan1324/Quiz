// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getRemoteConfig, fetchAndActivate, getValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-remote-config.js";
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
const auth = getAuth(app);
const db = getFirestore(app);

window.startQuizSingleplayerWithID = function(Id){
    console.log(Id)
    sessionStorage.setItem("id", Id);
}

window.startQuizSingleplayer = function(){
    let Value = parseInt(document.getElementById("ID").value);
    if(String(Value) == "NaN"){ Value = 0; }
    sessionStorage.setItem("id", Value);
}

async function createListElement(id){
    let title = await getDoc(doc(db, "Quizes", String(id)));
    title = title.data()["title"];
    document.getElementById("exploreIDs").innerHTML += `<li onclick="startQuizSingleplayerWithID(${id})"><a href="./quiz/index.html">${title}</a></li>`;
}

window.loadList = async function(){
    let Metadata = await getDoc(doc(db, "Metadata", "Quizes"));
    let newestID = Metadata.data()["newestQuizID"];
    let length = Metadata.data()["Explore-Length"] - 1;
    let doExplorePage = Metadata.data()["doExplorePage"];

    if(!doExplorePage) { return; }

    for(let i = newestID; i >= newestID - length; i--){
        try {
            createListElement(i);
            //await createListElement(i);
        } catch(e){ }
    }
}

await onAuthStateChanged(auth, (user) => {
    if (user) { 
        console.log(user);
        document.getElementById("Account").innerHTML = `<a href="./Account/user/?id=${user.uid}">${user["displayName"]}</a>`;
        document.getElementById("create").innerHTML = `<a href="./create/index.html"><button id="createBtn">Create Quiz</button></a>`;
    } else {
        document.getElementById("create").innerHTML = `<a>Sign-in or Sign-up to create a Quiz</a>`;
        document.getElementById("Account").innerHTML = `<a style="color:rgb(65, 182, 197)" href="./Account/index.html">Sign-in/Sign-up</a>`;
    }
});