import React from 'react';
import ReactDOM from 'react-dom';
import Clock from './modules/Clock/Clock.js';
import { app } from './db.js'
import { getDatabase, ref, onValue} from "firebase/database";

const db = getDatabase();
const timeRef = ref(db, "time/");

onValue(timeRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
  console.log("hello");
})

ReactDOM.render(<Clock/>, document.getElementById('mid1'));