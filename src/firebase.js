// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore"
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBg1--UpcBe9F8F-SrLMb6qQ1sEp6REV4U",
  authDomain: "blog-project-ridvan.firebaseapp.com",
  projectId: "blog-project-ridvan",
  storageBucket: "blog-project-ridvan.appspot.com",
  messagingSenderId: "199725687580",
  appId: "1:199725687580:web:0044ce659bb1503bba50d9",
  measurementId: "G-9YY8B2JWEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);




