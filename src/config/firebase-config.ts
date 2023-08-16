// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCYX-6JVxbB1lFXh5_FvlLj_gc1lG0YfYo",
    authDomain: "employees-art96.firebaseapp.com",
    projectId: "employees-art96",
    storageBucket: "employees-art96.appspot.com",
    messagingSenderId: "1006116516210",
    appId: "1:1006116516210:web:2a050fcf9019483a3c6deb"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase