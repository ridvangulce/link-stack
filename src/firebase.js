// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore"
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAGI50CdC86zDBSgdBNL-VRcTDFl1aVgTY",
    authDomain: "blog-project-ridvan.firebaseapp.com",
    projectId: "blog-project-ridvan",
    storageBucket: "blog-project-ridvan.appspot.com",
    messagingSenderId: "199725687580",
    appId: "1:199725687580:web:6c61afdd14cbed10ba50d9",
    measurementId: "G-2W2523LZ6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);




