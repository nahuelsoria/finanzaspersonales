import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD0klH3pSPoB9LCQzYjLrrszUKvjRP5Uk4",
    authDomain: "finanzaspersonales-4cd7a.firebaseapp.com",
    projectId: "finanzaspersonales-4cd7a",
    storageBucket: "finanzaspersonales-4cd7a.appspot.com",
    messagingSenderId: "443056098282",
    appId: "1:443056098282:web:5d869fa19e9f3f4e70c093",
    measurementId: "G-N019V2B1JN"
  }

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };