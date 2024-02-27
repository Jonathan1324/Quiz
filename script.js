// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getRemoteConfig, fetchAndActivate, getValue, activate, fetchConfig } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-remote-config.js";
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
const remoteConfig = getRemoteConfig(app);

window.startQuizSingleplayerWithID = function(Id){
    window.location.href = `${window.location.href}quiz/?qId=${Id}`;
}

window.startQuizSingleplayer = function(){
    let Value = parseInt(document.getElementById("ID").value);
    if(String(Value) == "NaN"){ Value = 0; }
    window.location.href = `${window.location.href}quiz/?qId=${Value}`;
}

async function createListElement(id){
    let title = await getDoc(doc(db, "Quizes", String(id)));
    try {
        title = title.data()["title"];
    } catch(e) { return; }
    document.getElementById("exploreIDs").innerHTML += `
        <li onclick="startQuizSingleplayerWithID(${id})"><a>${title}</a></li>
    `;
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
        } catch(e){ 
            document.getElementById("exploreIDs").innerHTML += `
                 <li onclick="startQuizSingleplayerWithID(1)"><a>not Loading</a></li>
            `;
        }
    }
}

window.logout = function(){
    signOut(auth)
    .then(function() {

    })
    .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;

        alert(errorMessage);
    })
}

await onAuthStateChanged(auth, (user) => {
    if (user) { 
        localStorage.setItem("UID", user.uid);
        let account = `
            <a href="./Account/user/?id=${user.uid}">${user["displayName"]}</a>
            <br>
            <button style="height: 3.75vh; width: 7vh; font-size: 1.5vh; margin-top: 1vh;" onclick="logout()">Logout</button>
        `;
        let Create = `<a href="./create/index.html"><button id="createBtn">Create Quiz</button></a>`;
        localStorage.setItem("AccountInnerHTML", account);
        localStorage.setItem("CreateInnerHTML", Create);
        console.log(user);
        document.getElementById("Account").innerHTML = account;
        document.getElementById("create").innerHTML = Create;

    } else {
        localStorage.setItem("AccountInnerHTML", `<a style="color:rgb(65, 182, 197)" href="./Account/index.html">Sign-in/Sign-up</a>`);
        localStorage.setItem("CreateInnerHTML", `<a id="createBtn">Sign-in or Sign-up to create a Quiz</a>`);
        document.getElementById("create").innerHTML = `<a id="createBtn">Sign-in or Sign-up to create a Quiz</a>`;
        document.getElementById("Account").innerHTML = `<a style="color:rgb(65, 182, 197)" href="./Account/index.html">Sign-in/Sign-up</a>`;
    }
});