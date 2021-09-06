// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-analytics.js";
import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.loggyyyyyyyyyyyy(1);
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVLFOHZH78eU1L3G0i4y7jHvnCQ3bBn0o",
  authDomain: "mirror-c9884.firebaseapp.com",
  databaseURL: "https://mirror-c9884-default-rtdb.firebaseio.com",
  projectId: "mirror-c9884",
  storageBucket: "mirror-c9884.appspot.com",
  messagingSenderId: "34657405784",
  appId: "1:34657405784:web:15e50fdaa189c02b34f32d",
  measurementId: "G-DE67V3RQ71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const timeRef = ref(db, "time/");
onValue(timeRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
})