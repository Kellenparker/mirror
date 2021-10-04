import React from 'react';
import ReactDOM from 'react-dom';
import Clock from './modules/Clock/Clock.js';
import { app } from './firebase.js'
import { getDatabase, ref, onValue, set} from "firebase/database";

const PiCamera = require('pi-camera');
const myCamera = new PiCamera({
  mode: 'photo',
  output: `${ __dirname }/test.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
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
  myCamera.snap()
    .then((result) => {
      console.log("Picture captured");
    })
    .catch((error) => {
      console.log("Picture failed");
    });

  set(cameraRef, {
    capture: false
  });

})

