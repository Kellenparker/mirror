import React from 'react';
import ReactDOM from 'react-dom';
import Clock from './modules/Clock/Clock.js';
import Scan from './modules/Scan/Scan.js';
import Weather from './modules/Weather/Weather.js'
import Calendar from './modules/Calendar/Calendar.js'
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

const weatherRef = ref(db, "modules/weather");
var weatherDisabled, weatherLocation;
onValue(weatherRef, (snapshot) => {
	weatherDisabled = snapshot.child('disabled').val();
	weatherLocation = snapshot.child('location').val();
	ReactDOM.render(<Weather disabled={weatherDisabled} />, document.getElementById(weatherLocation));
})

const calendarRef = ref(db, "modules/calendar");
var calendarDisabled, calendarLocation;
onValue(calendarRef, (snapshot) => {
	calendarDisabled = snapshot.child('disabled').val();
	calendarLocation = snapshot.child('location').val();
	ReactDOM.render(<Calendar disabled={calendarDisabled} />, document.getElementById(calendarLocation));
})

// ReactDOM.render(<Calendar/>, document.getElementById(3));


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
