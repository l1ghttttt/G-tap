// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB3YbK3dXhz8i1iXpENJItOIOT60qcSoZA",
    authDomain: "gtap-a75e8.firebaseapp.com",
    projectId: "gtap-a75e8",
    storageBucket: "gtap-a75e8.appspot.com",
    messagingSenderId: "79343027908",
    appId: "1:79343027908:web:6775021a9ee63498bd6b91",
    measurementId: "G-NZCE1W7NDF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);