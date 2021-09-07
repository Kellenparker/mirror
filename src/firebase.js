import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

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
