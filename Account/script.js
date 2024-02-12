// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, get, set, ref, update, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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
const database = getDatabase(app);

window.register = function() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let userName = document.getElementById("userName").value;

    if(!validateEmail(email) || !validatePassword(password)) {
        alert("Email or Password isn't valid.")
        return;
    }
    if(!validateField(userName)) {
        alert("UserName isn't valid.")
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user;

            let Ref = ref(database, `users/${user.uid}`);

            let userData = {
                email: email,
                last_login: Date.now(),
                created_at: Date.now(),
                public: {
                    userName: userName,
                    description: "description",
                    profilePictureURL: `${window.location.href.substring(0, window.location.href.lastIndexOf('/account'))}/src/defaultProfilePicture.jpg`
                }
            };

            console.log(userData);
            set(Ref, userData)
                .then(function() {
                    window.location.href = `${window.location.href}user/?id=${user.uid}`;
                })
                .catch((error) => {
                    let errorCode = error.code;
                    let errorMessage = error.message;
        
                    alert(errorMessage);
                })
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;

            alert(errorMessage);
        })
}

window.login = function() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if(!validateEmail(email) || !validatePassword(password)) {
        alert("Email or Password isn't valid.")
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user;

            let Ref = ref(database, `users/${user.uid}`);

            let userData = {
                last_login: Date.now()
            };

            update(Ref, userData)
                .then(function() {
                    window.location.href = `${window.location.href}user/?id=${user.uid}`;
                })
                .catch((error) => {
                    let errorCode = error.code;
                    let errorMessage = error.message;
        
                    alert(errorMessage);
                })
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;

            alert(errorMessage);
        })
}

function validateEmail(email) {
    if(/^[^@]+@\w+(\.\w+)+\w$/.test(email)) { return true; }
    else { return false; }
}

function validatePassword(password){
    if(password < 6){ return false; }
    else { return true; }
}

function validateField(field){
    if(field == null || field.length <= 0){ return false; }
    else { return true; }
}

await onAuthStateChanged(auth, (user) => {
    if (!user) {
        document.getElementById("buttonContainer").innerHTML = `
        <button onclick="login()">Login</button>
        <button onclick="register()">Register</button>
        `;
    }
});