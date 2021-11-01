import React from 'react';
import ReactDOM from 'react-dom';
import Clock from './modules/Clock/Clock.js';
import { app } from './firebase.js'
import { getDatabase, ref, onValue, set} from "firebase/database";
var request = require('request');

var clientServerOptions = {
  uri: 'http://localhost:3001/',
}
request(clientServerOptions, function (error, response) {
    console.log(error,response.body);
    return;
});

const db = getDatabase();
const timeRef = ref(db, "time/");
var timeData;
onValue(timeRef, (snapshot) => {
  timeData = snapshot.val();
  console.log(timeData);
  ReactDOM.render(<Clock disabled={timeData}/>, document.getElementById('mid1'));
})

const captureRef = ref(db, "camera/capture/");
const cameraRef = ref(db, "camera/");
var captureData;

onValue(captureRef, (snapshot) => {
  captureData = snapshot.val();
  console.log(captureData);
  if(captureData){
    var clientServerOptions = {
      uri: 'http://localhost:3001/capture',
    }
    request(clientServerOptions, function (error, response) {
        console.log(error,response.body);
        return;
    });
    set(cameraRef, {
      capture: false
    });
  }
})
