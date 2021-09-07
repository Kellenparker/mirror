import React from 'react';
import ReactDOM from 'react-dom';
import Clock from './modules/Clock/Clock.js';
import { app } from './firebase.js'
import { getDatabase, ref, onValue} from "firebase/database";

const db = getDatabase();
const timeRef = ref(db, "time/");
var data;

onValue(timeRef, (snapshot) => {
  data = snapshot.val();
  console.log(data);
  ReactDOM.render(<Clock disabled={data}/>, document.getElementById('mid1'));
})
