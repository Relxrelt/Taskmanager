// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import "firebase/firestore";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5Ae6nrVPvf8kijkgt6Dy0gQsSdNQINL0",
  authDomain: "tasktimers-8b7e4.firebaseapp.com",
  projectId: "tasktimers-8b7e4",
  storageBucket: "tasktimers-8b7e4.appspot.com",
  messagingSenderId: "304813364389",
  appId: "1:304813364389:web:211518846c714dfc8b694c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const docRef = doc(db, "highscores", "68FoG6bjRzV6mslUqnKx");
const coll = collection;
async function fetchFirestoreData() {
  const docSnap = await getDoc(docRef);
  console.log(docSnap.data());
}

window.fetchFirestoreData = fetchFirestoreData;
window.auth = auth;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.onAuthStateChanged = onAuthStateChanged;
window.db = db;
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;
window.updateDoc = updateDoc;
