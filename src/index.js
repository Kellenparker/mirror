import React from 'react';
import ReactDOM from 'react-dom';
import Clock from './modules/Clock/Clock.js';
import Scan from './modules/Scan/Scan.js';
import { app } from './firebase.js';
import { getDatabase, ref, onValue, set } from "firebase/database";
var request = require('request');

// Call localhost:3001/ to initialize Firebase
var clientServerOptions = {
	uri: 'http://localhost:3001/',
};
request(clientServerOptions, function (error, response) {
	console.log(error, response.body);
	return;
});

const db = getDatabase();
const scanStageRef = ref(db, "scan/stage");
var scanStage;
onValue(scanStageRef, (snapshot) => {
	scanStage = snapshot.val();
	ReactDOM.render(<Scan stage={scanStage}/>, document.getElementById('mid2'));
})

const timeRef = ref(db, "modules/time");
var timeDisabled, timeLocation;
onValue(timeRef, (snapshot) => {
	timeDisabled = snapshot.child('disabled').val();
	timeLocation = snapshot.child('location').val();
	ReactDOM.render(<Clock disabled={timeDisabled} />, document.getElementById(timeLocation));
})

// Get capture value
const captureRef = ref(db, "scan/camera/capture/");
const cameraRef = ref(db, "scan/camera/");
var captureData;
onValue(captureRef, (snapshot) => {
	captureData = snapshot.val();
	console.log(captureData);

	// If capture is true, initialize server side scan function
	if (captureData) {
		var clientServerOptions = {
			uri: 'http://localhost:3001/capture',
		};
		request(clientServerOptions, function (error, response) {
			console.log(error, response.body);
			return;
		});
		// Set capture back to false after calling server function
		set(cameraRef, {
			capture: false
		});
	}
})
